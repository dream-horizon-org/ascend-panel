import { ReactFlow, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, TextField, Select, MenuItem, IconButton, Button, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Control, useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';

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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <TextField
        size="small"
        type="text"
        value={data.percentage || ''}
        onChange={(e) => data.onChange?.(e.target.value)}
        placeholder="0"
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        sx={{ width: '80px', '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }}
      />
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
        borderTopRightRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem',
        paddingLeft: '0.5rem',
        paddingRight: '1rem',
        borderLeft: '4px solid #0060E526',
        backgroundColor: 'white',
        minWidth: '350px',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <TextField
        placeholder="Variant Name"
        size="small"
        value={data.name}
        onChange={(e) => data.onNameChange?.(e.target.value)}
        sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' }, width: '40%' }}
      />
      
      {/* Multiple Key-Value Rows */}
      {keyValues.map((kv: any, index: number) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: index < keyValues.length - 1 ? 1 : 0 }}>
          <TextField 
            size="small" 
            placeholder="Key" 
            value={kv.key}
            onChange={(e) => data.onKeyValueChange?.(index, 'key', e.target.value)}
            sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} 
          />
          <Select 
            size="small" 
            value={kv.type}
            onChange={(e) => data.onKeyValueChange?.(index, 'type', e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected === 'type' || selected === '') {
                return <Box sx={{ color: '#999999' }}>Type</Box>;
              }
              return selected.charAt(0).toUpperCase() + selected.slice(1);
            }}
            sx={{ width: '120px', borderRadius: '0.25rem' }}
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </Select>
          <TextField 
            size="small" 
            placeholder="Value" 
            value={kv.value}
            onChange={(e) => data.onKeyValueChange?.(index, 'value', e.target.value)}
            sx={{ flex: 2, '& .MuiOutlinedInput-root': { borderRadius: '0.25rem' } }} 
          />
          
          {/* Show delete button only if more than one item */}
          {keyValues.length > 1 && (
            <IconButton 
              size="small" 
              sx={{ color: '#666666', width: 40, height: 40, flexShrink: 0 }}
              onClick={() => data.onDeleteKeyValue?.(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          
          {/* Only show add button for the last item */}
          {index === keyValues.length - 1 ? (
            <IconButton 
              size="small" 
              sx={{ color: '#666666', width: 40, height: 40, flexShrink: 0 }}
              onClick={() => data.onAddKeyValue?.(index)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          ) : (
            <Box sx={{ width: 40, height: 40, flexShrink: 0 }} /> // Placeholder to maintain alignment
          )}
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

interface VariantsFlowProps {
  control: Control<any>;
}

export default function VariantsFlow({ control }: VariantsFlowProps) {
  // Use field arrays for proper react-hook-form management
  const { fields: variantFields, append: appendVariant, update: updateVariant } = useFieldArray({
    control,
    name: 'variants'
  });
  
  const variantsConfig = useMemo(() => variantFields.map((v: any) => ({
    name: v.name,
    trafficSplit: v.trafficSplit,
    keyValues: v.keyValues
  })), [variantFields]);
  
  // Generate nodes with onChange handlers (memoized for performance)
  const nodes = useMemo(() => {
    const generateNodesWithHandlers = (variantsConfig: any[]) => {
    const COLUMN_GAP = 400;
    const MIN_SPACING = 50;
    const START_X = 5;
    const START_Y = 50;
    const ROW_HEIGHT = 48;
    const BASE_HEIGHT = 64;
    const TARGETING_HEIGHT = 100;

    const nodes = [];
    let currentY = START_Y;
    const variantPositions: number[] = [];
    
    variantsConfig.forEach((config) => {
      const cardHeight = BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT;
      variantPositions.push(currentY + cardHeight / 2);
      currentY += cardHeight + MIN_SPACING;
    });
    
    const firstVariantCenter = variantPositions[0];
    const lastVariantCenter = variantPositions[variantPositions.length - 1];
    const targetingY = (firstVariantCenter + lastVariantCenter) / 2 - TARGETING_HEIGHT / 2;
    
    nodes.push({
      id: 'targeting',
      type: 'targeting',
      position: { x: START_X, y: targetingY },
      data: { label: 'Everyone' }
    });

    currentY = START_Y;
    
    variantsConfig.forEach((config, i) => {
      const cardHeight = BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT;
      
      nodes.push({
        id: `split-${i + 1}`,
        type: 'trafficSplit',
        position: { x: START_X + COLUMN_GAP, y: currentY + cardHeight / 2 -30 },
        data: { 
          percentage: config.trafficSplit || '',
          onChange: (value: string) => {
            // Only allow numbers and empty string
            if (value === '' || /^\d+$/.test(value)) {
              const currentVariant: any = variantFields[i];
              updateVariant(i, { ...currentVariant, trafficSplit: value });
            }
          }
        }
      });

      nodes.push({
        id: i === 0 ? 'control' : `variant-${i}`,
        type: 'variant',
        position: { x: START_X + COLUMN_GAP * 2, y: currentY },
        data: { 
          name: config.name,
          keyValues: config.keyValues,
          onNameChange: (value: string) => {
            const currentVariant: any = variantFields[i];
            updateVariant(i, { ...currentVariant, name: value });
          },
          onKeyValueChange: (index: number, field: string, value: string) => {
            const currentVariant: any = variantFields[i];
            const newKeyValues = [...currentVariant.keyValues];
            newKeyValues[index] = { ...newKeyValues[index], [field]: value };
            updateVariant(i, { ...currentVariant, keyValues: newKeyValues });
          },
          onAddKeyValue: (afterIndex: number) => {
            const currentVariant: any = variantFields[i];
            const newKeyValues = [...currentVariant.keyValues];
            newKeyValues.splice(afterIndex + 1, 0, { key: '', type: 'type', value: '' });
            updateVariant(i, { ...currentVariant, keyValues: newKeyValues });
          },
          onDeleteKeyValue: (index: number) => {
            const currentVariant: any = variantFields[i];
            const newKeyValues = [...currentVariant.keyValues];
            // Only allow delete if more than one key-value pair
            if (newKeyValues.length > 1) {
              newKeyValues.splice(index, 1);
              updateVariant(i, { ...currentVariant, keyValues: newKeyValues });
            }
          }
        }
      });
      
      currentY += cardHeight + MIN_SPACING;
    });

    return nodes;
    };
    
    return generateNodesWithHandlers(variantsConfig);
  }, [variantsConfig, variantFields, updateVariant]);
  
  const edges = useMemo(() => generateEdges(variantsConfig.length), [variantsConfig.length]);
  
  // Calculate canvas height dynamically
  const canvasHeight = useMemo(() => {
    const ROW_HEIGHT = 48;
    const BASE_HEIGHT = 64;
    const MIN_SPACING = 50;
    return 200 + variantsConfig.reduce((sum: number, config: any) => {
      return sum + BASE_HEIGHT + config.keyValues.length * ROW_HEIGHT + MIN_SPACING;
    }, 0);
  }, [variantsConfig]);

  return (
    <Box>
      <Box sx={{ height: `${canvasHeight}px`, width: '100%', overflow: 'auto', mb: 0 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          startIcon={<AddIcon />} 
          onClick={() => {
            // Calculate variant number: Control Group is index 0, Variant 2 is index 1, etc.
            // So new variant number = current length + 1
            const newVariantNumber = variantFields.length + 1;
            appendVariant({
              name: `Variant ${newVariantNumber}`,
              trafficSplit: '50',
              keyValues: [{ key: '', type: 'type', value: '' }]
            });
          }}
          sx={{ textTransform: 'none', color: '#333333', fontFamily: 'Inter', fontWeight: 500, fontSize: '0.875rem' }}
        >
          Add Variant
        </Button>
      </Box>
    </Box>
  );
}