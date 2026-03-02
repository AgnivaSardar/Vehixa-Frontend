import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiclesService } from '../services';
import { useInView } from '../hooks/useInView';

interface VehicleFormData {
  vehicleNumber: string;
  manufacturer: string;
  model: string;
  year: number | '';
  vehicleType: string;
  vin: string;
  engineType: string;
  fuelType: string;
  registrationDate: string;
}

const VEHICLE_TYPES = [
  'SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON', 'MINIVAN',
  'MOTORCYCLE', 'SCOOTER',
  'PICKUP_TRUCK', 'LIGHT_TRUCK', 'HEAVY_TRUCK', 'TRAILER', 'BUS', 'SCHOOL_BUS', 'DELIVERY_VAN',
  'ELECTRIC', 'HYBRID', 'PLUG_IN_HYBRID',
  'CONSTRUCTION', 'AGRICULTURAL', 'EMERGENCY', 'MILITARY', 'FLEET_VEHICLE'
];

const FUEL_TYPES = [
  'PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'PLUG_IN_HYBRID', 'CNG', 'LPG', 'HYDROGEN'
];

const ENGINE_TYPES = [
  'INLINE', 'V_TYPE', 'BOXER', 'ROTARY', 'ELECTRIC_MOTOR'
];

export default function VehicleRegistration() {
  const { ref, isInView } = useInView(0.05);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleNumber: '',
    manufacturer: '',
    model: '',
    year: '',
    vehicleType: '',
    vin: '',
    engineType: '',
    fuelType: '',
    registrationDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.vehicleNumber) {
      setError('Vehicle number is required');
      return;
    }
    if (!formData.fuelType) {
      setError('Fuel type is required');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      const vehicleData: any = {
        vehicleNumber: formData.vehicleNumber,
        fuelType: formData.fuelType,
      };

      // Add optional fields only if provided
      if (formData.manufacturer) vehicleData.manufacturer = formData.manufacturer;
      if (formData.model) vehicleData.model = formData.model;
      if (formData.year) vehicleData.year = formData.year;
      if (formData.vehicleType) vehicleData.vehicleType = formData.vehicleType;
      if (formData.vin) vehicleData.vin = formData.vin;
      if (formData.engineType) vehicleData.engineType = formData.engineType;
      if (formData.registrationDate) vehicleData.registrationDate = new Date(formData.registrationDate).toISOString();

      await vehiclesService.createVehicle(vehicleData);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register vehicle');
      console.error('Vehicle registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="register-vehicle"
      className="relative min-h-screen py-24 px-4"
      style={{ background: 'linear-gradient(180deg, #0a0a0f, #0d1420, #0a0a0f)' }}
    >
      <div ref={ref} className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#00ff88] mb-3 block">
            Register
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Register Your <span className="neon-text">Vehicle</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Add your vehicle details to start monitoring its health.
          </p>
        </div>

        <div
          className="glass-card p-8 transition-all duration-700"
          style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(40px)' }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Number - Required */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Vehicle Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g., DL-01-AB-1234"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Fuel Type - Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Fuel Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                >
                  <option value="">Select fuel type</option>
                  {FUEL_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Tesla, Honda"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Model S, Civic"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                >
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Engine Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Engine Type
                </label>
                <select
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                >
                  <option value="">Select engine type</option>
                  {ENGINE_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* VIN */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="17-character VIN"
                  maxLength={17}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>

              {/* Registration Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Registration Date
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00dd77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
