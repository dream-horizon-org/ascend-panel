import { ReactFlow, Handle, Position } from '@xyflow/react';
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
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </Box>
  );
};

// Custom node for Traffic Split
const TrafficSplitNode = ({ data }: any) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <TextField
        size="small"
        value={data.percentage}
        sx={{ width: '80px', '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
      />
      <Box sx={{ fontSize: '0.875rem', color: '#666666' }}>%</Box>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </Box>
  );
};

// Custom node for Variant
const VariantNode = ({ data }: any) => {
  const keyValues = data.keyValues || [{ key: '', type: 'type', value: '' }];
  
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
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <TextField
        fullWidth
        size="small"
        value={data.name}
        sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
      />
      
      {/* Multiple Key-Value Rows */}
      {keyValues.map((kv: any, index: number) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: index < keyValues.length - 1 ? 1 : 0 }}>
          <TextField 
            size="small" 
            placeholder="Key" 
            value={kv.key}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} 
          />
          <Select 
            size="small" 
            value={kv.type}
            sx={{ flex: 1, borderRadius: '0.25rem' }}
          >
            <MenuItem value="type">Type</MenuItem>
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </Select>
          <TextField 
            size="small" 
            placeholder="Value" 
            value={kv.value}
            sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} 
          />
          <IconButton size="small" sx={{ color: '#666666' }}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

const nodeTypes = {
  targeting: TargetingNode,
  trafficSplit: TrafficSplitNode,
  variant: VariantNode,
};

// Auto-layout function to calculate positions with dynamic heights
const calculateLayout = (variantsConfig: Array<{ name: string; keyValues: any[] }>) => {
  const COLUMN_GAP = 400;
  const MIN_SPACING = 50; // Minimum gap between cards
  const START_X = 5;
  const START_Y = 50;
  const ROW_HEIGHT = 48; // Height per key-value row
  const BASE_HEIGHT = 80; // Base card height
  const TARGETING_HEIGHT = 100; // Approximate height of targeting box

  const nodes = [];
  let currentY = START_Y;
  const variantPositions: number[] = [];
  
  // Calculate all variant positions first
  variantsConfig.forEach((config) => {
    const cardHeight = BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT;
    variantPositions.push(currentY + cardHeight / 2); // Store center position
    currentY += cardHeight + MIN_SPACING;
  });
  
  // Calculate targeting position - center it between first and last variant
  const firstVariantCenter = variantPositions[0];
  const lastVariantCenter = variantPositions[variantPositions.length - 1];
  const targetingY = (firstVariantCenter + lastVariantCenter) / 2 - TARGETING_HEIGHT / 2;
  
  nodes.push({
    id: 'targeting',
    type: 'targeting',
    position: { x: START_X, y: targetingY },
    data: { label: 'Everyone' }
  });

  // Reset for second pass
  currentY = START_Y;
  
  // Traffic splits and variants with dynamic spacing
  variantsConfig.forEach((config, i) => {
    const cardHeight = BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT;
    
    // Traffic split positioned at card center
    nodes.push({
      id: `split-${i + 1}`,
      type: 'trafficSplit',
      position: { x: START_X + COLUMN_GAP, y: currentY + cardHeight / 2 - 20 },
      data: { percentage: '50' }
    });

    // Variant card
    nodes.push({
      id: i === 0 ? 'control' : `variant-${i}`,
      type: 'variant',
      position: { x: START_X + COLUMN_GAP * 2, y: currentY },
      data: { name: config.name, keyValues: config.keyValues }
    });
    
    // Move to next position
    currentY += cardHeight + MIN_SPACING;
  });

  return nodes;
};


// Auto-generate edges based on number of variants
const generateEdges = (variants: number) => {
  const edges = [];
  
  for (let i = 0; i < variants; i++) {
    const splitId = `split-${i + 1}`;
    const variantId = i === 0 ? 'control' : `variant-${i}`;
    
    // Targeting to split (curved)
    edges.push({
      id: `e-targeting-${splitId}`,
      source: 'targeting',
      target: splitId,
      style: { stroke: '#DADADD', strokeWidth: 2 }
    });

    // Split to variant (straight line)
    edges.push({
      id: `e-${splitId}-${variantId}`,
      source: splitId,
      target: variantId,
      type: 'straight',
      style: { stroke: '#DADADD', strokeWidth: 2 }
    });
  }

  return edges;
};

export default function VariantsFlow() {
  // Define variants with their key-values
  const variantsConfig = [
    {
      name: 'Control Group',
      keyValues: [
        { key: 'color', type: 'string', value: 'blue' },
      ]
    },
    {
      name: 'Variant 2',
      keyValues: [{ key: '', type: 'type', value: '' },
      ]
    },
    {
      name: 'Variant 3',
      keyValues: [{ key: '', type: 'type', value: '' }]
    },
    {
      name: 'Variant 4',
      keyValues: [{ key: '', type: 'type', value: '' }]
    },
    {
      name: 'Variant 5',
      keyValues: [{ key: '', type: 'type', value: '' }]
    }
  ];
  
  const nodes = calculateLayout(variantsConfig);
  const edges = generateEdges(variantsConfig.length);
  
  // Calculate canvas height dynamically based on card heights
  const ROW_HEIGHT = 48;
  const BASE_HEIGHT = 80;
  const MIN_SPACING = 50;
  const canvasHeight = 200 + variantsConfig.reduce((sum, config) => {
    return sum + BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT + MIN_SPACING;
  }, 0);

  return (
    <Box>
      <Box sx={{ height: `${canvasHeight}px`, width: '100%', border: '1px solid #f0f0f0', borderRadius: '0.5rem', overflow: 'auto' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={1}
          maxZoom={1}
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