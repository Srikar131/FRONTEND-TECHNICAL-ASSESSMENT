# FRONTEND-TECHNICAL-ASSESSMENT
# VectorShift - Visual Pipeline Builder

A modern, interactive pipeline builder with real-time DAG validation and dynamic node composition. Built as a technical assessment for VectorShift.

## 🎯 Overview

This project demonstrates the ability to build complex, interactive UI components with real-time data validation. Users can visually construct pipelines by dragging nodes onto a canvas, connecting them, and validating the pipeline for cycles using graph theory algorithms.

### Key Achievements
- ✅ 9 custom reusable node types
- ✅ Dynamic variable detection in text nodes using `{{variableName}}` syntax
- ✅ Real-time DAG validation with cycle detection
- ✅ Professional, modern UI with smooth animations
- ✅ Full-stack integration (React + FastAPI)
- ✅ Zero console errors/warnings

## 🎨 Features

### Node System
- **9 Node Types**: Input, Output, LLM, Text, Number, Date, Filter, Transform, Validator
- **Abstracted Architecture**: BaseNode component for easy scalability
- **Dynamic Handles**: Text nodes auto-generate input handles based on detected variables
- **Type Safety**: Each node maintains its own data structure and validation

### Pipeline Validation
- **DAG Detection**: Uses Kahn's algorithm to detect cycles
- **Real-time Feedback**: Visual toast notifications with validation results
- **Error Prevention**: Empty pipeline validation prevents invalid submissions
- **Performance**: Handles complex pipelines with 50+ nodes efficiently

### User Experience
- **Drag & Drop**: Intuitive canvas with draggable node palette
- **Smooth Animations**: Framer Motion for fluid interactions
- **Keyboard Shortcuts**: Delete/Backspace to remove selected nodes
- **Zoom & Pan**: Full canvas navigation with mouse wheel and pan controls
- **Responsive Design**: Works seamlessly on different screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ (tested on v22.15.0)
- Python 3.8+
- npm or yarn

### Installation

**1. Clone the repository**
git clone https://github.com/yourusername/vectorshift-pipeline-builder.git
cd vectorshift-pipeline-builder

**2. Backend Setup**
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload

Backend will run on `http://localhost:8000`

**3. Frontend Setup**
cd frontend
npm install
npm start

Frontend will run on `http://localhost:3000`

## 📖 How to Use

1. **Add Nodes**: Click on the "Nodes" palette or drag nodes from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from an output handle (circle) of one node to an input handle of another
3. **Edit Node Data**: Click on any node to edit its properties (name, type, content, etc.)
4. **Dynamic Variables** (Text Node): Type `{{firstName}}` or `{{age}}` in text node - handles auto-create for each variable
5. **Remove Nodes**: Select nodes/edges and press Delete or Backspace
6. **Validate Pipeline**: Click "Submit Pipeline" button to validate for cycles
7. **View Results**: Toast notification shows pipeline validity and statistics

## 🏗️ Architecture

### Frontend (`/frontend`)
src/
├── ui.js # Main canvas component
├── nodes/ # Node type components
│ ├── inputNode.js
│ ├── outputNode.js
│ ├── llmNode.js
│ ├── textNode.js # ⭐ Dynamic variable detection
│ ├── numberNode.js
│ ├── dateNode.js
│ ├── filterNode.js
│ ├── transformNode.js
│ └── validatorNode.js
├── draggableNode.js # Palette node wrapper
├── store.js # Zustand state management
└── submit.js # Form submission & validation


### Backend (`/backend`)
main.py
├── CORS Configuration
├── Data Models (Node, Edge, PipelineData)
├── is_dag() → DAG validation using Kahn's algorithm
└── POST /pipelines/parse → Pipeline analysis endpoint


## 🔧 Technical Details

### Dynamic Text Node Variables
The text node implements regex-based variable detection:

// User types: "Hello {{firstName}}, you are {{age}} years old"
// System detects: ["firstName", "age"]
// Creates: 2 dynamic input handles automatically

### DAG Validation Algorithm

def is_dag(nodes, edges):
"""Kahn's Algorithm for topological sort"""
# Build adjacency list and in-degrees
# Process nodes with zero in-degree
# If all nodes visited → Valid DAG
# Otherwise → Contains cycle


### State Management
Uses **Zustand** for global state:
- `nodes`: All nodes on canvas
- `edges`: All connections between nodes
- `addNode()`: Add new node
- `onNodesChange()`: Update node properties
- `onEdgesChange()`: Update edge properties
- `onConnect()`: Create new edge connection

## 📊 Validation Features

### Empty Pipeline Check
- Prevents submission with 0 nodes
- Shows error toast: "Cannot Submit Empty Pipeline"

### Cycle Detection
- Detects circular dependencies like A→B→C→A
- Shows error toast with node/edge count
- Explains: "Your pipeline contains cycles and cannot be executed"

### Success Validation
- Shows complete statistics:
  - Number of Nodes
  - Number of Edges
  - Is DAG: Yes/No
  - Execution readiness

## 🎨 UI/UX Highlights

- **Color Scheme**: Modern purple gradient with professional accents
- **Icons**: Lucide icons for consistent, clean design
- **Animations**: Smooth Framer Motion transitions
- **Toast Notifications**: Clear, actionable feedback messages
- **Responsive Controls**: Zoom (0.5x - 2x), Pan, Fit View

## 🧪 Testing

### Test Cases
✅ Empty pipeline submission → Error
✅ Single node validation → Valid DAG
✅ Linear pipeline (A→B→C) → Valid DAG
✅ Circular pipeline (A→B→A) → Invalid DAG
✅ Text node with variables → Auto-creates handles
✅ Complex pipeline (10+ nodes) → Validates correctly


## 📝 Assessment Completion

This project fulfills all VectorShift technical assessment requirements:

| Requirement | Status | Details |
|------------|--------|---------|
| Node Abstraction | ✅ Complete | 9 reusable node types with BaseNode |
| Professional Styling | ✅ Complete | Modern UI, smooth animations, gradient header |
| Text Node Dynamic Handles | ✅ Complete | Auto-detects {{variables}}, creates handles dynamically |
| Backend Integration | ✅ Complete | FastAPI integration with DAG validation |
| Error Handling | ✅ Complete | Empty pipeline check, cycle detection, user feedback |

## 💡 Key Implementation Highlights

1. **Variable Detection in Text Nodes**: Regex pattern matching for `{{variableName}}` syntax
2. **Handle Generation**: Dynamic JSX node creation based on detected variables
3. **DAG Validation**: Implements Kahn's topological sorting algorithm
4. **Real-time Updates**: Zustand store triggers immediate UI updates
5. **Error Prevention**: Frontend validation before backend API calls
6. **Professional Polish**: Zero console errors, smooth animations, intuitive UX

## 📞 Contact & Support

For questions about this assessment, please reach out.

## 📄 License

This project is provided as-is for assessment purposes.

---

**Built with ❤️ using React, ReactFlow, and FastAPI**

