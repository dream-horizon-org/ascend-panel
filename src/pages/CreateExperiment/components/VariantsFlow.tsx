import { ReactFlow, Handle, Position, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, TextField, Select, MenuItem, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

// Custom node for Targeting
const TargetingNode = ({ data }: any) => {
  return (
    <Box
      sx={{
        border: '1px solid #DADADD',
        borderRadius: '0.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        minWidth: '180px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.875rem', color: '#333333' }}>
          Targeting
        </Box>
        <EditIcon sx={{ fontSize: '0.875rem', color: '#666666', cursor: 'pointer' }} />
      </Box>
      <Box sx={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#666666' }}>
        {data.label}
      </Box>
      <Handle type="source" position={Position.Right} style={{ background: '#555', width: 8, height: 8 }} />
    </Box>
  );
};

// Custom node for Traffic Split
const TrafficSplitNode = ({ data }: any) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Handle type="target" position={Position.Left} style={{ background: '#555', width: 8, height: 8 }} />
      <TextField
        size="small"
        value={data.percentage}
        sx={{ width: '80px', '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
      />
      <Box sx={{ fontSize: '0.875rem', color: '#666666' }}>%</Box>
      <Handle type="source" position={Position.Right} style={{ background: '#555', width: 8, height: 8 }} />
    </Box>
  );
};

// Custom node for Variant
const VariantNode = ({ data }: any) => {
  return (
    <Box
      sx={{
        border: '1px solid #DADADD',
        borderRadius: '0.5rem',
        padding: '1rem',
        borderLeft: '4px solid #2196f3',
        backgroundColor: 'white',
        minWidth: '300px',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555', width: 8, height: 8 }} />
      <TextField
        fullWidth
        size="small"
        value={data.name}
        sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField size="small" placeholder="Key" sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} />
        <Select size="small" defaultValue="type" sx={{ flex: 1, borderRadius: '0.25rem' }}>
          <MenuItem value="type">Type</MenuItem>
          <MenuItem value="string">String</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="boolean">Boolean</MenuItem>
        </Select>
        <TextField size="small" placeholder="Value" sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} />
        <IconButton size="small" sx={{ color: '#666666' }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

const nodeTypes = {
  targeting: TargetingNode,
  trafficSplit: TrafficSplitNode,
  variant: VariantNode,
};

const initialNodes = [
  { id: 'targeting', type: 'targeting', position: { x: 5, y: 200 }, data: { label: 'Everyone' } },
  { id: 'split-1', type: 'trafficSplit', position: { x: 350, y: 60 }, data: { percentage: '50' } },
  { id: 'split-2', type: 'trafficSplit', position: { x: 350, y: 230 }, data: { percentage: '50' } },
  { id: 'split-3', type: 'trafficSplit', position: { x: 350, y: 400 }, data: { percentage: '50' } },
  { id: 'control', type: 'variant', position: { x: 550, y: 20 }, data: { name: 'Control Group' } },
  { id: 'variant-1', type: 'variant', position: { x: 550, y: 210 }, data: { name: 'Variant 1' } },
  { id: 'variant-2', type: 'variant', position: { x: 550, y: 380 }, data: { name: 'Variant 2' } },
];

const initialEdges = [
  { id: 'e1', source: 'targeting', target: 'split-1', style: { stroke: '#DADADD', strokeWidth: 2 } },
  { id: 'e2', source: 'targeting', target: 'split-2', style: { stroke: '#DADADD', strokeWidth: 2 } },
  { id: 'e3', source: 'targeting', target: 'split-3', style: { stroke: '#DADADD', strokeWidth: 2 } },
  { id: 'e4', source: 'split-1', target: 'control', style: { stroke: '#DADADD', strokeWidth: 2 } },
  { id: 'e5', source: 'split-2', target: 'variant-1', style: { stroke: '#DADADD', strokeWidth: 2 } },
  { id: 'e6', source: 'split-3', target: 'variant-2', style: { stroke: '#DADADD', strokeWidth: 2 } },
];

export default function VariantsFlow() {
  return (
    <Box>
      <Box sx={{ height: '600px', width: '100%', border: '1px solid #f0f0f0', borderRadius: '0.5rem' }}>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag={false}
        >


        </ReactFlow>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button startIcon={<AddIcon />} sx={{ textTransform: 'none', color: '#333333', fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem' }}>
          Add Variant
        </Button>
      </Box>
    </Box>
  );
}