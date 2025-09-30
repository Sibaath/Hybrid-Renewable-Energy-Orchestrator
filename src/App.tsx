import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, Leaf, Grid3x3 as Grid3X3, Calendar, MapPin, Settings, TrendingUp, TrendingDown, AlertTriangle, Battery, Thermometer, Plus, MessageCircle, Search, ChevronDown, ChevronRight, X, Mic, Send, Clock, Home, Building, Lightbulb } from 'lucide-react';

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
  { id: 1, name: 'Science Block', consumption: '145 kW', assets: 25, status: 'optimal' },
  { id: 2, name: 'Student Hostels', consumption: '89 kW', assets: 18, status: 'high' },
  { id: 3, name: 'Administration', consumption: '67 kW', assets: 12, status: 'optimal' },
  { id: 4, name: 'Library Complex', consumption: '34 kW', assets: 8, status: 'low' }
];

const mockScheduleData = [
  { 
    id: 1, 
    name: 'Main Water Pump', 
    schedule: [
      { hour: 6, type: 'solar', task: 'Primary Pumping' },
      { hour: 10, type: 'solar', task: 'Secondary Fill' },
      { hour: 14, type: 'battery', task: 'Maintenance Cycle' },
      { hour: 18, type: 'grid-peak', task: 'Evening Supply' }
    ]
  },
  {
    id: 2,
    name: 'EV Charging Hub',
    schedule: [
      { hour: 8, type: 'solar', task: 'Staff Vehicles' },
      { hour: 12, type: 'solar', task: 'Campus Buses' },
      { hour: 16, type: 'battery', task: 'Visitor Parking' }
    ]
  },
  {
    id: 3,
    name: 'HVAC - Science Block',
    schedule: [
      { hour: 7, type: 'solar', task: 'Pre-cooling' },
      { hour: 11, type: 'solar', task: 'Peak Cooling' },
      { hour: 15, type: 'grid-off-peak', task: 'Maintenance' },
      { hour: 19, type: 'grid-peak', task: 'Evening Comfort' }
    ]
  }
];

const mockAssets = {
  1: [
    { id: 101, name: 'HVAC Unit 1', power: '25 kW', status: 'running' },
    { id: 102, name: 'Lab Equipment', power: '45 kW', status: 'standby' },
    { id: 103, name: 'Lighting System', power: '15 kW', status: 'running' }
  ],
  2: [
    { id: 201, name: 'Room HVAC', power: '35 kW', status: 'running' },
    { id: 202, name: 'Common Area Lights', power: '12 kW', status: 'running' },
    { id: 203, name: 'Water Heaters', power: '18 kW', status: 'scheduled' }
  ]
};

const MiniChart = ({ data, trend, color = 'blue' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  return (
    <div className="flex items-end space-x-1 h-8">
      {data.map((value, index) => (
        <div
          key={index}
          className={`w-2 bg-${color}-500 rounded-t transition-all duration-300`}
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
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <Icon className={`w-8 h-8 text-${color}-600`} />
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
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`border rounded-lg p-3 mb-3 ${severityColors[alert.severity]}`}>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

const CampusHeatmapPreview = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Campus Energy Heatmap</h3>
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
        View Full Map →
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2 h-32">
      {mockZones.map((zone, index) => (
        <div
          key={zone.id}
          className={`rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
            zone.status === 'high' ? 'bg-red-200 text-red-800' :
            zone.status === 'optimal' ? 'bg-green-200 text-green-800' :
            'bg-blue-200 text-blue-800'
          }`}
        >
          {zone.name}
        </div>
      ))}
    </div>
  </div>
);

const ScheduleGrid = () => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'solar': return 'bg-green-500 text-white';
      case 'battery': return 'bg-blue-500 text-white';
      case 'grid-off-peak': return 'bg-orange-500 text-white';
      case 'grid-peak': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
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
            <div key={asset.id} className="flex mb-3 group hover:bg-gray-50 rounded-lg py-2">
              <div className="w-48 font-medium text-gray-800 py-1 px-2">{asset.name}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const task = asset.schedule.find(s => s.hour === hour);
                return (
                  <div key={hour} className="w-16 px-1">
                    {task ? (
                      <div
                        className={`h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${getTypeColor(task.type)}`}
                        title={`${task.task} (${hour}:00)`}
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
  );
};

const CampusExplorer = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAssets, setExpandedAssets] = useState(new Set());

  const filteredZones = mockZones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAssetExpansion = (zoneId) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(zoneId)) {
      newExpanded.delete(zoneId);
    } else {
      newExpanded.add(zoneId);
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedZone === zone.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
              } border`}
              onClick={() => setSelectedZone(zone.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.consumption}</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Campus Map</h3>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option>Live Demand</option>
              <option>Supply/Demand Mismatch</option>
              <option>Energy Savings</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-64">
            {mockZones.map((zone) => (
              <div
                key={zone.id}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  zone.status === 'high' ? 'bg-red-100 border-red-300' :
                  zone.status === 'optimal' ? 'bg-green-100 border-green-300' :
                  'bg-blue-100 border-blue-300'
                } border-2`}
                onClick={() => setSelectedZone(zone.id)}
              >
                <Building className="w-8 h-8 mb-2 text-gray-700" />
                <h4 className="font-medium text-gray-900">{zone.name}</h4>
                <p className="text-sm text-gray-600">{zone.consumption}</p>
                <p className="text-xs text-gray-500">{zone.assets} assets</p>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Browser */}
        {selectedZone && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assets in {mockZones.find(z => z.id === selectedZone)?.name}
            </h3>
            
            <div className="space-y-3">
              {mockAssets[selectedZone]?.map((asset) => (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleAssetExpansion(asset.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-600">{asset.power}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        asset.status === 'running' ? 'bg-green-100 text-green-800' :
                        asset.status === 'standby' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {asset.status}
                      </span>
                      {expandedAssets.has(asset.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  {expandedAssets.has(asset.id) && (
                    <div className="mt-3 pl-8 space-y-2 text-sm text-gray-600">
                      <div>Last maintenance: 2 days ago</div>
                      <div>Energy efficiency: 94%</div>
                      <div>Next scheduled maintenance: 5 days</div>
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

const EventSchedulingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const eventTypes = [
    { id: 'daily-fixed', name: 'Daily Fixed', description: 'Recurring tasks at fixed times', icon: Clock },
    { id: 'daily-flexible', name: 'Daily Flexible', description: 'Recurring tasks with flexible timing', icon: Calendar },
    { id: 'one-time-flexible', name: 'One-time Flexible', description: 'Single event with flexible timing', icon: Zap },
    { id: 'emergency', name: 'Emergency', description: 'Critical tasks requiring immediate scheduling', icon: AlertTriangle }
  ];

  const mockRecommendations = [
    { time: '1:30 PM', reason: 'Uses 100% Solar Power', savings: '₹450', efficiency: '98%' },
    { time: '10:30 AM', reason: 'Peak Solar Generation', savings: '₹420', efficiency: '95%' },
    { time: '3:00 PM', reason: 'Low Grid Demand Period', savings: '₹380', efficiency: '92%' }
  ];

  const handleEventTypeSelect = async (type) => {
    setEventType(type);
    if (type === 'daily-flexible' || type === 'one-time-flexible') {
      setIsProcessing(true);
      setStep(3);
      // Simulate AI processing
      setTimeout(() => {
        setRecommendations(mockRecommendations);
        setIsProcessing(false);
      }, 2000);
    } else {
      setStep(3);
    }
  };

  const resetModal = () => {
    setStep(1);
    setEventName('');
    setEventType('');
    setRecommendations([]);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Schedule New Event</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleEventTypeSelect(type.id)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      >
                        <Icon className="w-8 h-8 text-blue-600 mb-2" />
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

          {step === 3 && (
            <div className="space-y-6">
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Optimal Time Slots</h3>
                  <p className="text-gray-600">Our AI is finding the best times based on energy availability and costs...</p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Time Slots</h3>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{rec.time}</h4>
                              <p className="text-sm text-gray-600">{rec.reason}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-green-600">{rec.savings}</p>
                              <p className="text-sm text-gray-500">{rec.efficiency} efficient</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => { onClose(); resetModal(); }}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
    { id: 1, text: 'Hello! I can help you with energy management queries and event scheduling. How can I assist you today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: `Based on current data, ${inputText.toLowerCase().includes('energy') ? 'your campus is currently using 78% renewable energy with peak demand expected at 7 PM.' : 'I can help you schedule that event during optimal energy hours.'}`,
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Energy Assistant</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

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
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    { id: 'settings', name: 'Settings', icon: Settings }
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

            {/* Campus Heatmap Preview */}
            <CampusHeatmapPreview />
          </div>
        );
      case 'schedule':
        return <ScheduleGrid />;
      case 'explorer':
        return <CampusExplorer />;
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">System configuration and preferences will be available here.</p>
          </div>
        );
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
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
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
                {currentPage === 'settings' && 'System configuration and preferences'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Campus Status</p>
                <p className="text-xs text-green-600">All Systems Optimal</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Floating Action Buttons */}
      <button
        onClick={() => setShowEventModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-24 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-110 flex items-center justify-center z-40"
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