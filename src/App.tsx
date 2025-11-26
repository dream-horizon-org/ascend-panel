import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import {
  increment,
  decrement,
  incrementByAmount,
} from "./store/slices/counterSlice";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Autocomplete,
  Chip,
  IconButton,
  Slider,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Remove as RemoveIcon } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AscendModal from "./components/AscendModal/AscendModal";

// Form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Sample data for Autocomplete
interface CityOption {
  label: string;
  country: string;
  code: string;
}

const cities: CityOption[] = [
  { label: "New York", country: "USA", code: "NYC" },
  { label: "London", country: "UK", code: "LON" },
  { label: "Tokyo", country: "Japan", code: "TYO" },
  { label: "Paris", country: "France", code: "PAR" },
  { label: "Sydney", country: "Australia", code: "SYD" },
  { label: "Berlin", country: "Germany", code: "BER" },
  { label: "Toronto", country: "Canada", code: "YYZ" },
  { label: "Dubai", country: "UAE", code: "DXB" },
  { label: "Singapore", country: "Singapore", code: "SIN" },
  { label: "Mumbai", country: "India", code: "BOM" },
];

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [selectedCities, setSelectedCities] = useState<CityOption[]>([]);
  
  // Modal states
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [childModalOpen, setChildModalOpen] = useState(false);
  const [exposureValue, setExposureValue] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert(`Hello ${data.name}! Your message: ${data.message}`);
    reset();
  };

  // Handle parent modal close attempt - show child modal instead
  const handleParentModalClose = () => {
    setChildModalOpen(true);
  };

  // Handle child modal actions
  const handleChildModalCancel = () => {
    setChildModalOpen(false);
    // Stay in parent modal
  };

  const handleChildModalExit = () => {
    setChildModalOpen(false);
    setParentModalOpen(false);
    // Close both modals
  };

  return (
    <Container maxWidth="lg" className="min-h-screen py-8">
      <Box className="text-center mb-8">
        <Typography
          variant="h2"
          component="h1"
          className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          sx={{ fontWeight: "bold" }}
        >
          Hello World App
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Demonstrating Redux Toolkit, React Hook Form, Tailwind CSS & MUI
        </Typography>
        <Box className="mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setParentModalOpen(true)}
            sx={{ mt: 2 }}
          >
            Open Targeting Modal
          </Button>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Redux Toolkit Demo */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom className="mb-4">
                Redux Toolkit Counter
              </Typography>
              <Divider className="mb-4" />
              <Box className="text-center">
                <Typography
                  variant="h3"
                  className="mb-6 font-bold text-blue-600"
                >
                  {count}
                </Typography>
                <Box className="flex gap-4 justify-center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => dispatch(increment())}
                    className="px-6"
                  >
                    Increment
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<RemoveIcon />}
                    onClick={() => dispatch(decrement())}
                    className="px-6"
                  >
                    Decrement
                  </Button>
                </Box>
                <Box className="mt-4">
                  <Button
                    variant="outlined"
                    onClick={() => dispatch(incrementByAmount(5))}
                  >
                    Add 5
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* React Hook Form Demo */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom className="mb-4">
                React Hook Form
              </Typography>
              <Divider className="mb-4" />
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextField
                  fullWidth
                  label="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  {...register("message")}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  className="mb-4"
                />
                <Box className="flex gap-2">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>

        {/* MUI Autocomplete Demo */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom className="mb-4">
                MUI Autocomplete (Single)
              </Typography>
              <Divider className="mb-4" />
              <Autocomplete
                options={cities}
                value={selectedCity}
                onChange={(_, newValue) => setSelectedCity(newValue)}
                getOptionLabel={(option) =>
                  `${option.label}, ${option.country}`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a City"
                    placeholder="Search cities..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <LocationOnIcon
                          sx={{ ml: 1, color: "text.secondary" }}
                        />
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.code}>
                    <LocationOnIcon sx={{ mr: 2, color: "text.secondary" }} />
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.country} ({option.code})
                      </Typography>
                    </Box>
                  </Box>
                )}
                className="mb-4"
              />
              {selectedCity && (
                <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <Typography variant="body2" color="text.secondary">
                    Selected: <strong>{selectedCity.label}</strong> (
                    {selectedCity.country})
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* MUI Autocomplete Multiple Demo */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom className="mb-4">
                MUI Autocomplete (Multiple)
              </Typography>
              <Divider className="mb-4" />
              <Autocomplete
                multiple
                options={cities}
                value={selectedCities}
                onChange={(_, newValue) => setSelectedCities(newValue)}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Multiple Cities"
                    placeholder="Add cities..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.code}
                      label={`${option.label} (${option.code})`}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
                className="mb-4"
              />
              {selectedCities.length > 0 && (
                <Box className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-2"
                  >
                    Selected Cities ({selectedCities.length}):
                  </Typography>
                  <Box className="flex flex-wrap gap-1">
                    {selectedCities.map((city) => (
                      <Chip
                        key={city.code}
                        label={city.label}
                        size="small"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Tailwind CSS Demo */}
        <Box className="col-span-1 md:col-span-2">
          <Paper elevation={3} className="p-6">
            <Typography variant="h5" gutterBottom className="mb-4">
              Tailwind CSS Styling
            </Typography>
            <Divider className="mb-4" />
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-lg text-white shadow-lg">
                <Typography variant="h6" className="font-bold mb-2">
                  Gradient Card 1
                </Typography>
                <Typography variant="body2">
                  This card uses Tailwind's gradient utilities
                </Typography>
              </Box>
              <Box className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-lg text-white shadow-lg">
                <Typography variant="h6" className="font-bold mb-2">
                  Gradient Card 2
                </Typography>
                <Typography variant="body2">
                  Responsive grid layout with Tailwind
                </Typography>
              </Box>
              <Box className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-lg text-white shadow-lg">
                <Typography variant="h6" className="font-bold mb-2">
                  Gradient Card 3
                </Typography>
                <Typography variant="body2">
                  Beautiful styling with Tailwind CSS
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Parent Modal - Targeting */}
      <AscendModal
        config={{
          width: 600,
          closeOnBackdropClick: false,
          closeOnEscape: false,
          showCloseButton: false,
          nestedModal: {
            width: 400,
            showCloseButton: false,
            children: (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Close without saving?
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleChildModalCancel}
                    sx={{ ml: 'auto' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Discarding this will remove all information saved
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={handleChildModalCancel} variant="text" color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleChildModalExit} variant="contained" color="primary">
                    Exit
                  </Button>
                </Box>
              </Box>
            ),
          },
          actions: (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', width: '100%' }}>
              <Button onClick={handleParentModalClose} variant="text" color="primary">
                Cancel
              </Button>
              <Button onClick={handleParentModalClose} variant="contained" color="primary">
                Save
              </Button>
            </Box>
          ),
          children: (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header with Title and Close Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Targeting
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleParentModalClose}
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Filters Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Filters
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Users are filtered out irrespective of cohorts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ minWidth: 40 }}>IF</Typography>
                    <TextField select size="small" defaultValue="App Version" sx={{ minWidth: 150 }}>
                      <MenuItem value="App Version">App Version</MenuItem>
                      <MenuItem value="Country">Country</MenuItem>
                      <MenuItem value="Device">Device</MenuItem>
                    </TextField>
                    <TextField select size="small" defaultValue="Is not equal to" sx={{ minWidth: 150 }}>
                      <MenuItem value="Is not equal to">Is not equal to</MenuItem>
                      <MenuItem value="Is equal to">Is equal to</MenuItem>
                      <MenuItem value="Contains">Contains</MenuItem>
                    </TextField>
                    <TextField size="small" defaultValue="12.3" sx={{ width: 100 }} />
                    <IconButton size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Button size="small" variant="outlined">+3</Button>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ minWidth: 40 }}>AND</Typography>
                    <TextField select size="small" defaultValue="Country" sx={{ minWidth: 150 }}>
                      <MenuItem value="Country">Country</MenuItem>
                      <MenuItem value="App Version">App Version</MenuItem>
                      <MenuItem value="Device">Device</MenuItem>
                    </TextField>
                    <TextField select size="small" defaultValue="Is equal to" sx={{ minWidth: 150 }}>
                      <MenuItem value="Is equal to">Is equal to</MenuItem>
                      <MenuItem value="Is not equal to">Is not equal to</MenuItem>
                      <MenuItem value="Contains">Contains</MenuItem>
                    </TextField>
                    <TextField size="small" defaultValue="India" sx={{ width: 100 }} />
                    <IconButton size="small" color="primary">
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Cohorts Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Cohorts
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {['Tag1', 'Tag2', 'Tag3', 'Tag4'].map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => {}}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ))}
                  <Button size="small" variant="outlined">+3</Button>
                </Box>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Assign cohorts directly to variants"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Assigning cohorts will make it <strong>inaccurate and risky</strong>. Make sure to verify each cohort.
                </Typography>
              </Box>

              {/* Exposure Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Exposure
                  </Typography>
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={exposureValue}
                    onChange={(_, newValue) => setExposureValue(newValue as number)}
                    min={0}
                    max={100}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    value={`${exposureValue}%`}
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ readOnly: true }}
                  />
                </Box>
              </Box>
            </Box>
          ),
        }}
        open={parentModalOpen}
        onClose={handleParentModalClose}
        nestedModalOpen={childModalOpen}
        onNestedModalClose={handleChildModalCancel}
      />
    </Container>
  );
}

export default App;
