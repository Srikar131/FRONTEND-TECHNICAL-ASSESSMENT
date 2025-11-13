from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from collections import defaultdict, deque

app = FastAPI()

# Enable CORS so frontend can connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data structure for the request
class Node(BaseModel):
    id: str

class Edge(BaseModel):
    source: str
    target: str

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# Function to check if graph is a DAG (Directed Acyclic Graph)
def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """Check if the graph is a DAG using Kahn's algorithm"""
    # Build adjacency list and calculate in-degrees
    graph = defaultdict(list)
    in_degree = {node.id: 0 for node in nodes}
    
    for edge in edges:
        graph[edge.source].append(edge.target)
        if edge.target in in_degree:
            in_degree[edge.target] += 1
    
    # Kahn's algorithm for topological sort
    queue = deque([node for node in in_degree if in_degree[node] == 0])
    visited_count = 0
    
    while queue:
        node = queue.popleft()
        visited_count += 1
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, it's a DAG
    return visited_count == len(nodes)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(data: PipelineData):
    """
    Parse the pipeline and return:
    - num_nodes: number of nodes
    - num_edges: number of edges  
    - is_dag: whether it's a Directed Acyclic Graph
    """
    num_nodes = len(data.nodes)
    num_edges = len(data.edges)
    dag_status = is_dag(data.nodes, data.edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_status
    }
