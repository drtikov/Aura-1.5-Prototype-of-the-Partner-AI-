
// components/GraphVisualization.tsx
import React, { useEffect, useRef, useState } from 'react';
import { loadSdk } from '../core/sdkLoader';
import { useLocalization } from '../context/AuraContext';

declare const d3: any;

interface Node {
    id: string;
    label: string;
}

interface Link {
    source: string;
    target: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

export const GraphVisualization = ({ data }: { data: GraphData }) => {
    const ref = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 550, height: 350 });
    const [isD3Loaded, setIsD3Loaded] = useState(false);
    const { t } = useLocalization();

    // Load D3
    useEffect(() => {
        loadSdk('d3').then(() => setIsD3Loaded(true)).catch(console.error);
    }, []);

    // Handle resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight || 350
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!data || !ref.current || !isD3Loaded || typeof d3 === 'undefined') return;

        const { width, height } = dimensions;
        const { nodes, links } = data;
        
        // Clone data to avoid mutating props during d3 simulation
        const nodesClone = nodes.map(d => ({ ...d }));
        const linksClone = links.map(d => ({ ...d }));

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('background-color', 'var(--panel-bg)');

        // Clear previous render
        svg.selectAll("*").remove();
        
        const g = svg.append("g");

        const simulation = d3.forceSimulation(nodesClone)
            .force("link", d3.forceLink(linksClone).id((d: any) => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(10));

        const link = g.append("g")
            .attr("stroke", "var(--border-color)")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(linksClone)
            .join("line")
            .attr("stroke-width", 1.5);

        const node = g.append("g")
            .attr("stroke", "var(--border-color)")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodesClone)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "var(--primary-color)");

        const label = g.append("g")
            .selectAll("text")
            .data(nodesClone)
            .join("text")
            .text((d: any) => d.label)
            .attr("font-size", "10px")
            .attr("fill", "var(--text-color)")
            .attr("dx", 8)
            .attr("dy", ".35em");

        node.append("title")
            .text((d: any) => d.label);
            
        // Drag functionality
        const drag = (simulation: any) => {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }
        node.call(drag(simulation));

        // Zoom functionality
        const zoom = d3.zoom().on("zoom", (event: any) => {
            g.attr("transform", event.transform);
        });
        svg.call(zoom);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
            
            label
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

    }, [data, dimensions, isD3Loaded]);

    if (!isD3Loaded) {
        return <div className="kg-placeholder"><div className="spinner-small" /> Loading Graph Engine...</div>;
    }

    return (
        <div ref={containerRef} className="graph-visualization-container" style={{ width: '100%', height: '100%' }}>
            <svg ref={ref}></svg>
        </div>
    );
};
