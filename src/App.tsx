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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
    </Container>
  );
}

export default App;
