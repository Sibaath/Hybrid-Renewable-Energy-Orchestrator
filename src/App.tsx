import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, Leaf, Grid3x3 as Grid3X3, Calendar, MapPin, Settings, TrendingUp, TrendingDown, AlertTriangle, Battery, Thermometer, Plus, MessageCircle, Search, ChevronDown, ChevronRight, X, Mic, Send, Clock, Home, Building, Lightbulb, Wind, Sun, Database, Cpu, Wifi, Shield, Users, Activity, Power, Gauge, Info, Target, Wrench, Eye, BarChart2, PieChart, LineChart } from 'lucide-react';

// Mock data
const mockKPIData = {
  savings: { value: '₹2,45,890', trend: 12.5, data: [220000, 225000, 240000, 245890] },
  carbon: { value: '1,250 kg', trend: -8.2, data: [1400, 1350, 1280, 1250] },
  renewable: { value: '78%', trend: 15.3, data: [65, 70, 75, 78] },
  grid: { value: '22%', trend: -18.7, data: [35, 30, 25, 22] }
};

const mockAlerts = [
  { id: 1, type: 'warning', icon: AlertTriangle, message: 'High Peak Grid Usage Expected at 7 PM', time: '2 mins ago', severity: 'warning' },
  { id: 2, type: 'critical', icon: Battery, message: 'Battery Storage at 15% Capacity', time: '5 mins ago', severity: 'critical' },
  { id: 3, type: 'info', icon: Thermometer, message: 'HVAC System Optimized for Evening', time: '15 mins ago', severity: 'info' }
];

const mockZones = [
  { id: 1, name: 'Science Block', consumption: '145 kW', assets: 25, status: 'optimal', x: 20, y: 30, width: 25, height: 20 },
  { id: 2, name: 'Student Hostels', consumption: '89 kW', assets: 18, status: 'high', x: 55, y: 15, width: 30, height: 25 },
  { id: 3, name: 'Administration', consumption: '67 kW', assets: 12, status: 'optimal', x: 15, y: 60, width: 20, height: 15 },
  { id: 4, name: 'Library Complex', consumption: '34 kW', assets: 8, status: 'low', x: 65, y: 55, width: 25, height: 20 },
  { id: 5, name: 'Sports Complex', consumption: '78 kW', assets: 15, status: 'optimal', x: 40, y: 75, width: 35, height: 15 },
  { id: 6, name: 'Cafeteria', consumption: '56 kW', assets: 10, status: 'high', x: 75, y: 25, width: 15, height: 15 }
];

const mockScheduleData = [
  { 
    id: 1, 
    name: 'Main Water Pump', 
    schedule: [
      { hour: 6, type: 'solar', task: 'Primary Pumping', details: { power: '25kW', duration: '2h', savings: '₹450', efficiency: '95%' } },
      { hour: 10, type: 'solar', task: 'Secondary Fill', details: { power: '15kW', duration: '1h', savings: '₹280', efficiency: '92%' } },
      { hour: 14, type: 'battery', task: 'Maintenance Cycle', details: { power: '8kW', duration: '30min', savings: '₹120', efficiency: '88%' } },
      { hour: 18, type: 'grid-peak', task: 'Evening Supply', details: { power: '20kW', duration: '1.5h', cost: '₹680', efficiency: '85%' } }
    ]
  },
  {
    id: 2,
    name: 'EV Charging Hub',
    schedule: [
      { hour: 8, type: 'solar', task: 'Staff Vehicles', details: { power: '50kW', duration: '3h', savings: '₹750', efficiency: '96%' } },
      { hour: 12, type: 'solar', task: 'Campus Buses', details: { power: '80kW', duration: '2h', savings: '₹920', efficiency: '94%' } },
      { hour: 16, type: 'battery', task: 'Visitor Parking', details: { power: '30kW', duration: '2h', savings: '₹420', efficiency: '90%' } }
    ]
  },
  {
    id: 3,
    name: 'HVAC - Science Block',
    schedule: [
      { hour: 7, type: 'solar', task: 'Pre-cooling', details: { power: '35kW', duration: '2h', savings: '₹580', efficiency: '93%' } },
      { hour: 11, type: 'solar', task: 'Peak Cooling', details: { power: '65kW', duration: '4h', savings: '₹1200', efficiency: '91%' } },
      { hour: 15, type: 'grid-off-peak', task: 'Maintenance', details: { power: '12kW', duration: '1h', cost: '₹180', efficiency: '87%' } },
      { hour: 19, type: 'grid-peak', task: 'Evening Comfort', details: { power: '45kW', duration: '3h', cost: '₹980', efficiency: '84%' } }
    ]
  }
];

const mockAssets = {
  1: [
    { id: 101, name: 'HVAC Unit 1', power: '25 kW', status: 'running', efficiency: '94%', lastMaintenance: '2 days ago' },
    { id: 102, name: 'Lab Equipment', power: '45 kW', status: 'standby', efficiency: '89%', lastMaintenance: '1 week ago' },
    { id: 103, name: 'Lighting System', power: '15 kW', status: 'running', efficiency: '96%', lastMaintenance: '3 days ago' }
  ],
  2: [
    { id: 201, name: 'Room HVAC', power: '35 kW', status: 'running', efficiency: '92%', lastMaintenance: '5 days ago' },
    { id: 202, name: 'Common Area Lights', power: '12 kW', status: 'running', efficiency: '97%', lastMaintenance: '1 day ago' },
    { id: 203, name: 'Water Heaters', power: '18 kW', status: 'scheduled', efficiency: '88%', lastMaintenance: '1 week ago' }
  ]
};

const mockSystemData = {
  battery: {
    level: 78,
    capacity: '500 kWh',
    charging: true,
    timeToFull: '2h 15min',
    cycles: 1247,
    health: 94,
    temperature: 24
  },
  solar: {
    currentOutput: '245 kW',
    maxCapacity: '350 kW',
    efficiency: 92,
    panels: 1200,
    activeUnits: 1185,
    dailyGeneration: '2.8 MWh',
    weather: 'Sunny'
  },
  wind: {
    currentOutput: '89 kW',
    maxCapacity: '150 kW',
    efficiency: 87,
    turbines: 3,
    activeTurbines: 3,
    windSpeed: '12 m/s',
    dailyGeneration: '1.2 MWh'
  }
};

const eventTypes = [
  { 
    id: 'maintenance', 
    name: 'Maintenance', 
    description: 'Equipment servicing and repairs',
    icon: Wrench,
    color: 'blue',
    fields: ['equipment', 'priority', 'duration', 'technician']
  },
  { 
    id: 'hvac-operation', 
    name: 'HVAC Operation', 
    description: 'Heating, ventilation, and air conditioning',
    icon: Thermometer,
    color: 'green',
    fields: ['zone', 'temperature', 'duration', 'mode']
  },
  { 
    id: 'lighting', 
    name: 'Lighting Control', 
    description: 'Campus lighting management',
    icon: Lightbulb,
    color: 'yellow',
    fields: ['zone', 'brightness', 'duration', 'schedule']
  },
  { 
    id: 'water-pump', 
    name: 'Water Systems', 
    description: 'Water pumping and distribution',
    icon: Activity,
    color: 'cyan',
    fields: ['system', 'flow-rate', 'duration', 'pressure']
  },
  { 
    id: 'ev-charging', 
    name: 'EV Charging', 
    description: 'Electric vehicle charging stations',
    icon: Zap,
    color: 'purple',
    fields: ['station', 'power-level', 'duration', 'vehicle-type']
  },
  { 
    id: 'emergency', 
    name: 'Emergency', 
    description: 'Critical operations requiring immediate attention',
    icon: AlertTriangle,
    color: 'red',
    fields: ['type', 'priority', 'response-team', 'duration']
  }
];

const MiniChart = ({ data, trend, color = 'blue' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  return (
    <div className="flex items-end space-x-1 h-8">
      {data.map((value, index) => (
        <div
          key={index}
          className={`w-2 bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
          style={{
            height: `${((value - min) / (max - min)) * 100}%`,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
};

const KPICard = ({ title, value, trend, data, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span className="text-sm font-medium">{Math.abs(trend)}%</span>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
    <MiniChart data={data} trend={trend} color={color} />
  </div>
);

const AlertItem = ({ alert }) => {
  const { icon: Icon } = alert;
  const severityColors = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`border rounded-lg p-3 mb-3 transition-all duration-200 hover:shadow-md ${severityColors[alert.severity]}`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">{alert.message}</p>
          <p className="text-xs opacity-75 mt-1">{alert.time}</p>
        </div>
      </div>
    </div>
  );
};

const PredictiveChart = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const supply = [20, 15, 10, 8, 12, 25, 45, 70, 85, 90, 95, 88, 82, 78, 75, 65, 45, 25, 15, 12, 10, 8, 6, 4];
  const demand = [45, 40, 35, 30, 35, 50, 65, 80, 95, 100, 105, 110, 108, 105, 100, 95, 90, 85, 75, 65, 55, 50, 48, 46];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Supply vs Demand Forecast</h3>
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Supply area */}
          <path
            d={`M 0 ${200 - supply[0] * 2} ${supply.map((val, i) => `L ${(i * 400) / 23} ${200 - val * 2}`).join(' ')} L 400 200 L 0 200 Z`}
            fill="rgba(34, 197, 94, 0.3)"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
          />
          {/* Demand area */}
          <path
            d={`M 0 ${200 - demand[0] * 2} ${demand.map((val, i) => `L ${(i * 400) / 23} ${200 - val * 2}`).join(' ')} L 400 200 L 0 200 Z`}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Supply (Renewable)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Demand</span>
        </div>
      </div>
    </div>
  );
};

const InteractiveHeatmap = ({ selectedZone, onZoneSelect, hoveredZone, onZoneHover }) => {
  const getZoneColor = (status) => {
    switch (status) {
      case 'high': return '#ef4444';
      case 'optimal': return '#22c55e';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Interactive Campus Heatmap</h3>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Live Demand</option>
          <option>Supply/Demand Mismatch</option>
          <option>Energy Savings</option>
          <option>Carbon Footprint</option>
        </select>
      </div>
      
      <div className="relative bg-gray-50 rounded-lg p-4 h-80 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Campus paths */}
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" />
          <path d="M30,0 L30,100" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
          <path d="M70,0 L70,100" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
          <path d="M0,30 L100,30" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
          <path d="M0,70 L100,70" fill="none" stroke="#d1d5db" strokeWidth="0.3" />
          
          {/* Zone buildings */}
          {mockZones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={getZoneColor(zone.status)}
                fillOpacity={selectedZone === zone.id ? 0.9 : hoveredZone === zone.id ? 0.7 : 0.6}
                stroke={selectedZone === zone.id ? '#1f2937' : 'white'}
                strokeWidth={selectedZone === zone.id ? 0.8 : 0.3}
                rx="1"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => onZoneHover(zone.id)}
                onMouseLeave={() => onZoneHover(null)}
                onClick={() => onZoneSelect(zone.id)}
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2"
                fill="white"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {zone.name.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Tooltip */}
        {hoveredZone && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10">
            {(() => {
              const zone = mockZones.find(z => z.id === hoveredZone);
              return zone ? (
                <div>
                  <h4 className="font-medium text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">Consumption: {zone.consumption}</p>
                  <p className="text-sm text-gray-600">Assets: {zone.assets}</p>
                  <p className={`text-sm font-medium ${
                    zone.status === 'high' ? 'text-red-600' :
                    zone.status === 'optimal' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    Status: {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">High Usage</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Optimal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Low Usage</span>
        </div>
      </div>
    </div>
  );
};

const ScheduleInsightModal = ({ isOpen, onClose, taskData }) => {
  if (!isOpen || !taskData) return null;

  const getTypeInfo = (type) => {
    switch (type) {
      case 'solar': return { color: 'green', label: 'Solar Power', icon: Sun };
      case 'battery': return { color: 'blue', label: 'Battery Storage', icon: Battery };
      case 'grid-off-peak': return { color: 'orange', label: 'Off-Peak Grid', icon: Grid3X3 };
      case 'grid-peak': return { color: 'red', label: 'Peak Grid', icon: AlertTriangle };
      default: return { color: 'gray', label: 'Unknown', icon: Power };
    }
  };

  const typeInfo = getTypeInfo(taskData.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg bg-${typeInfo.color}-100`}>
                <TypeIcon className={`w-6 h-6 text-${typeInfo.color}-600`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{taskData.task}</h3>
                <p className="text-sm text-gray-600">{typeInfo.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Power Consumption</p>
                <p className="text-lg font-semibold text-gray-900">{taskData.details.power}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold text-gray-900">{taskData.details.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  {taskData.details.savings ? 'Savings' : 'Cost'}
                </p>
                <p className={`text-lg font-semibold ${
                  taskData.details.savings ? 'text-green-600' : 'text-red-600'
                }`}>
                  {taskData.details.savings || taskData.details.cost}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Efficiency</p>
                <p className="text-lg font-semibold text-blue-600">{taskData.details.efficiency}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Optimization Insights</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {taskData.type === 'solar' && (
                  <>
                    <li>• Peak solar generation period</li>
                    <li>• Zero carbon emissions</li>
                    <li>• Maximum cost savings</li>
                  </>
                )}
                {taskData.type === 'battery' && (
                  <>
                    <li>• Using stored renewable energy</li>
                    <li>• Grid independence maintained</li>
                    <li>• Moderate cost savings</li>
                  </>
                )}
                {taskData.type === 'grid-off-peak' && (
                  <>
                    <li>• Lower electricity rates</li>
                    <li>• Reduced grid congestion</li>
                    <li>• Acceptable cost impact</li>
                  </>
                )}
                {taskData.type === 'grid-peak' && (
                  <>
                    <li>• High electricity rates</li>
                    <li>• Consider rescheduling if possible</li>
                    <li>• Maximum grid strain period</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleGrid = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case 'solar': return 'bg-green-500 text-white hover:bg-green-600';
      case 'battery': return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'grid-off-peak': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'grid-peak': return 'bg-red-500 text-white hover:bg-red-600';
      default: return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowInsights(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Smart Energy Schedule</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Solar/Wind Power</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Battery Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Off-Peak Grid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Peak Grid (Expensive)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="flex mb-4">
              <div className="w-48 font-semibold text-gray-900 py-2">Asset/Zone</div>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="w-16 text-center text-xs text-gray-600 py-2">{i}:00</div>
              ))}
            </div>

            {/* Schedule rows */}
            {mockScheduleData.map((asset) => (
              <div key={asset.id} className="flex mb-3 group hover:bg-gray-50 rounded-lg py-2 transition-colors duration-200">
                <div className="w-48 font-medium text-gray-800 py-1 px-2">{asset.name}</div>
                {Array.from({ length: 24 }, (_, hour) => {
                  const task = asset.schedule.find(s => s.hour === hour);
                  return (
                    <div key={hour} className="w-16 px-1">
                      {task ? (
                        <div
                          className={`h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 transform ${getTypeColor(task.type)}`}
                          title={`${task.task} (${hour}:00) - Click for insights`}
                          onClick={() => handleTaskClick(task)}
                        >
                          <Clock className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="h-8"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScheduleInsightModal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        taskData={selectedTask}
      />
    </>
  );
};

const CampusExplorer = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAssets, setExpandedAssets] = useState(new Set());

  const filteredZones = mockZones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAssetExpansion = (assetId) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Zone List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Campus Zones</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search zones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedZone === zone.id ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-gray-50 hover:bg-gray-100'
              } border`}
              onClick={() => setSelectedZone(zone.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.consumption}</p>
                  <p className="text-xs text-gray-500">{zone.assets} assets</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  zone.status === 'high' ? 'bg-red-500' :
                  zone.status === 'optimal' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Campus View */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interactive Heatmap */}
        <InteractiveHeatmap
          selectedZone={selectedZone}
          onZoneSelect={setSelectedZone}
          hoveredZone={hoveredZone}
          onZoneHover={setHoveredZone}
        />

        {/* Asset Browser */}
        {selectedZone && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assets in {mockZones.find(z => z.id === selectedZone)?.name}
            </h3>
            
            <div className="space-y-3">
              {mockAssets[selectedZone]?.map((asset) => (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleAssetExpansion(asset.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-600">{asset.power}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'running' ? 'bg-green-100 text-green-800' :
                        asset.status === 'standby' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {asset.status}
                      </span>
                      {expandedAssets.has(asset.id) ? 
                        <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </div>
                  
                  {expandedAssets.has(asset.id) && (
                    <div className="mt-3 pl-8 space-y-2 text-sm text-gray-600 animate-in slide-in-from-top duration-200">
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="font-medium text-green-600">{asset.efficiency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last maintenance:</span>
                        <span>{asset.lastMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next scheduled maintenance:</span>
                        <span>5 days</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SystemConfiguration = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'System Overview', icon: BarChart3 },
    { id: 'battery', name: 'Battery Storage', icon: Battery },
    { id: 'solar', name: 'Solar Panels', icon: Sun },
    { id: 'wind', name: 'Wind Turbines', icon: Wind },
    { id: 'network', name: 'Network', icon: Wifi }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Cpu className="w-8 h-8" />
                <span className="text-sm opacity-90">System Status</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Operational</h3>
              <p className="text-sm opacity-90">All systems running normally</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-sm opacity-90">Security</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Secure</h3>
              <p className="text-sm opacity-90">No security threats detected</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <span className="text-sm opacity-90">Active Users</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">24</h3>
              <p className="text-sm opacity-90">Connected to the system</p>
            </div>
          </div>
        );
        
      case 'battery':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Battery Level</h3>
                  <Battery className="w-6 h-6 text-green-600" />
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${mockSystemData.battery.level}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span className="font-medium text-green-600">{mockSystemData.battery.level}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Battery Health</h3>
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{mockSystemData.battery.health}%</div>
                  <p className="text-sm text-gray-600">Excellent condition</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Battery Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{mockSystemData.battery.capacity}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Charge Cycles</p>
                  <p className="text-lg font-semibold text-gray-900">{mockSystemData.battery.cycles}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-lg font-semibold text-gray-900">{mockSystemData.battery.temperature}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time to Full</p>
                  <p className="text-lg font-semibold text-gray-900">{mockSystemData.battery.timeToFull}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'solar':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Solar Power System</h2>
                  <p className="opacity-90">Real-time solar generation monitoring</p>
                </div>
                <Sun className="w-16 h-16 opacity-80" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-90 mb-1">Current Output</p>
                  <p className="text-3xl font-bold">{mockSystemData.solar.currentOutput}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Efficiency</p>
                  <p className="text-3xl font-bold">{mockSystemData.solar.efficiency}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Panel Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Panels</span>
                    <span className="font-medium">{mockSystemData.solar.panels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Units</span>
                    <span className="font-medium text-green-600">{mockSystemData.solar.activeUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Capacity</span>
                    <span className="font-medium">{mockSystemData.solar.maxCapacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Generation</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{mockSystemData.solar.dailyGeneration}</div>
                  <p className="text-sm text-gray-600">Generated today</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{mockSystemData.solar.weather}</div>
                  <p className="text-sm text-gray-600">Optimal for generation</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'wind':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Wind Power System</h2>
                  <p className="opacity-90">Wind turbine performance monitoring</p>
                </div>
                <Wind className="w-16 h-16 opacity-80" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-90 mb-1">Current Output</p>
                  <p className="text-3xl font-bold">{mockSystemData.wind.currentOutput}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Wind Speed</p>
                  <p className="text-3xl font-bold">{mockSystemData.wind.windSpeed}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Turbine Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Turbines</span>
                    <span className="font-medium">{mockSystemData.wind.turbines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Turbines</span>
                    <span className="font-medium text-green-600">{mockSystemData.wind.activeTurbines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Capacity</span>
                    <span className="font-medium">{mockSystemData.wind.maxCapacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Generation</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 mb-2">{mockSystemData.wind.dailyGeneration}</div>
                  <p className="text-sm text-gray-600">Generated today</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{mockSystemData.wind.efficiency}%</div>
                  <p className="text-sm text-gray-600">Current efficiency</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'network':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Main Gateway</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Sensor Network</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700">Backup Connection</span>
                    <span className="text-yellow-600 font-medium">Standby</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Network Uptime</p>
                    <p className="text-2xl font-bold text-green-600">99.8%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Connected Devices</p>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

const EventSchedulingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [eventName, setEventName] = useState('');
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockRecommendations = [
    { time: '1:30 PM', reason: 'Uses 100% Solar Power', savings: '₹450', efficiency: '98%', carbonSaved: '2.5kg' },
    { time: '10:30 AM', reason: 'Peak Solar Generation', savings: '₹420', efficiency: '95%', carbonSaved: '2.2kg' },
    { time: '3:00 PM', reason: 'Low Grid Demand Period', savings: '₹380', efficiency: '92%', carbonSaved: '1.8kg' }
  ];

  const handleEventTypeSelect = async (eventType) => {
    setSelectedEventType(eventType);
    setStep(3);
  };

  const handleDetailsSubmit = () => {
    setIsProcessing(true);
    setStep(4);
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsProcessing(false);
    }, 2500);
  };

  const resetModal = () => {
    setStep(1);
    setEventName('');
    setSelectedEventType(null);
    setEventDetails({});
    setRecommendations([]);
    setIsProcessing(false);
  };

  const renderEventTypeFields = () => {
    if (!selectedEventType) return null;

    return (
      <div className="space-y-4">
        {selectedEventType.fields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {field.replace('-', ' ')}
            </label>
            {field === 'priority' ? (
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventDetails[field] || ''}
                onChange={(e) => setEventDetails({...eventDetails, [field]: e.target.value})}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            ) : field === 'zone' ? (
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventDetails[field] || ''}
                onChange={(e) => setEventDetails({...eventDetails, [field]: e.target.value})}
              >
                <option value="">Select zone</option>
                {mockZones.map((zone) => (
                  <option key={zone.id} value={zone.name}>{zone.name}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.includes('temperature') ? 'number' : 'text'}
                placeholder={`Enter ${field.replace('-', ' ')}`}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventDetails[field] || ''}
                onChange={(e) => setEventDetails({...eventDetails, [field]: e.target.value})}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Event</h2>
              <div className="flex items-center space-x-2 mt-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => { onClose(); resetModal(); }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to schedule?
                </label>
                <input
                  type="text"
                  placeholder="Enter event name (e.g., Laboratory Equipment Maintenance)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!eventName.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Event Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleEventTypeSelect(type)}
                        className={`p-4 border-2 rounded-lg hover:shadow-md transition-all duration-200 text-left ${
                          selectedEventType?.id === type.id 
                            ? `border-${type.color}-500 bg-${type.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 text-${type.color}-600 mb-2`} />
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back
              </button>
            </div>
          )}

          {step === 3 && selectedEventType && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {selectedEventType.name} Details
                </h3>
                {renderEventTypeFields()}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDetailsSubmit}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Find Optimal Times
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Optimal Time Slots</h3>
                  <p className="text-gray-600">Our AI is finding the best times based on energy availability, costs, and carbon impact...</p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Time Slots</h3>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900 text-lg">{rec.time}</h4>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  Recommended
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Savings:</span>
                                  <span className="font-medium text-green-600 ml-1">{rec.savings}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Efficiency:</span>
                                  <span className="font-medium text-blue-600 ml-1">{rec.efficiency}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Carbon Saved:</span>
                                  <span className="font-medium text-green-600 ml-1">{rec.carbonSaved}</span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => { onClose(); resetModal(); }}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Schedule Event
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! I\'m your Smart Energy Assistant. I can help you with energy management queries, schedule events, and provide insights about your campus energy usage. How can I assist you today?', 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions] = useState([
    'Show current energy usage',
    'Schedule maintenance',
    'Battery status',
    'Solar panel efficiency',
    'Peak usage times'
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { 
      id: Date.now(), 
      text: inputText, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
    
    setIsTyping(true);
    
    // Simulate bot response with more intelligent responses
    setTimeout(() => {
      let botResponse = '';
      const query = inputText.toLowerCase();
      
      if (query.includes('energy') || query.includes('usage')) {
        botResponse = 'Based on current data, your campus is using 78% renewable energy with total consumption at 335 kW. Peak demand is expected at 7 PM. Would you like me to show you the detailed breakdown by zone?';
      } else if (query.includes('battery')) {
        botResponse = `Battery status: Currently at ${mockSystemData.battery.level}% capacity with ${mockSystemData.battery.timeToFull} remaining to full charge. Battery health is excellent at ${mockSystemData.battery.health}%.`;
      } else if (query.includes('solar')) {
        botResponse = `Solar system is generating ${mockSystemData.solar.currentOutput} at ${mockSystemData.solar.efficiency}% efficiency. Weather conditions are ${mockSystemData.solar.weather.toLowerCase()}, which is optimal for generation.`;
      } else if (query.includes('schedule') || query.includes('event')) {
        botResponse = 'I can help you schedule events for optimal energy usage. Would you like me to open the event scheduling interface, or do you have a specific event in mind?';
      } else if (query.includes('alert') || query.includes('warning')) {
        botResponse = 'Current alerts: High peak grid usage expected at 7 PM, Battery storage at 15% capacity. Would you like me to provide recommendations to address these issues?';
      } else {
        botResponse = `I understand you're asking about "${inputText}". I can provide information about energy usage, system status, scheduling events, and campus energy optimization. Could you be more specific about what you'd like to know?`;
      }
      
      const response = { 
        id: Date.now() + 1, 
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);

    setInputText('');
  };

  const handleQuickAction = (action) => {
    setInputText(action);
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold">Energy Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {quickActions.slice(0, 3).map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-2 rounded-2xl text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md'
                }`}
              >
                {message.text}
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp}
              </p>
            </div>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about energy usage, schedule events..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`p-2 rounded-lg transition-colors ${
              isVoiceMode ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
    { id: 'explorer', name: 'Campus Explorer', icon: MapPin },
    { id: 'settings', name: 'System Config', icon: Settings }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Real-Time Savings"
                value={mockKPIData.savings.value}
                trend={mockKPIData.savings.trend}
                data={mockKPIData.savings.data}
                icon={Zap}
                color="green"
              />
              <KPICard
                title="Carbon Footprint Reduction"
                value={mockKPIData.carbon.value}
                trend={mockKPIData.carbon.trend}
                data={mockKPIData.carbon.data}
                icon={Leaf}
                color="green"
              />
              <KPICard
                title="Renewable Energy Usage"
                value={mockKPIData.renewable.value}
                trend={mockKPIData.renewable.trend}
                data={mockKPIData.renewable.data}
                icon={Grid3X3}
                color="blue"
              />
              <KPICard
                title="Grid Dependence"
                value={mockKPIData.grid.value}
                trend={mockKPIData.grid.trend}
                data={mockKPIData.grid.data}
                icon={BarChart3}
                color="orange"
              />
            </div>

            {/* Charts and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PredictiveChart />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Alerts</h3>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Heatmap */}
            <InteractiveHeatmap
              selectedZone={null}
              onZoneSelect={() => {}}
              hoveredZone={null}
              onZoneHover={() => {}}
            />
          </div>
        );
      case 'schedule':
        return <ScheduleGrid />;
      case 'explorer':
        return <CampusExplorer />;
      case 'settings':
        return <SystemConfiguration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">EnergyOS</h1>
                <p className="text-xs text-gray-600">Smart Campus</p>
              </div>
            )}
          </div>
        </div>

        <nav className="px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-4 left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{currentPage}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentPage === 'dashboard' && 'Real-time energy monitoring and insights'}
                {currentPage === 'schedule' && 'Smart energy scheduling and optimization'}
                {currentPage === 'explorer' && 'Campus energy asset management'}
                {currentPage === 'settings' && 'System configuration and monitoring'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Campus Status</p>
                <p className="text-xs text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  All Systems Optimal
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <button
        onClick={() => setShowEventModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 flex items-center justify-center z-40 group"
        title="Schedule New Event"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-24 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-110 flex items-center justify-center z-40 group"
        title="Open Energy Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Modals */}
      <EventSchedulingModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} />
      <ChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />
    </div>
  );
};

export default App;