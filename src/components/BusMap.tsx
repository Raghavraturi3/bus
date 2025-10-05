import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, Route, dehradunBuses, dehradunRoutes } from '@/data/dehradunRoutes';
import { MessageCircle, X, Send, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface BusMapProps {
  selectedRoute?: string;
  selectedBus?: string;
  onBusClick?: (bus: Bus) => void;
  buses?: Bus[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
}

const BusMap: React.FC<BusMapProps> = ({ selectedRoute, selectedBus, onBusClick, buses = dehradunBuses }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const busMarkers = useRef<L.LayerGroup>(new L.LayerGroup());
  const routeLines = useRef<L.LayerGroup>(new L.LayerGroup());
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm SAARTHI assistant. How can I help you today? You can ask about routes, book tickets, or check bus status.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = L.map(mapRef.current, {
      center: [30.894552432530066, 75.86055640720483],
      zoom: 8.4,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    L.control.zoom({ position: 'topright' }).addTo(map.current);
    busMarkers.current.addTo(map.current);
    routeLines.current.addTo(map.current);

    // Initialize voice recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        addBotMessage("Sorry, I didn't catch that. Could you please try again?");
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Update route lines
  useEffect(() => {
    if (!map.current) return;

    routeLines.current.clearLayers();

    const routesToShow = selectedRoute 
      ? dehradunRoutes.filter(route => route.id === selectedRoute)
      : dehradunRoutes;

    routesToShow.forEach(route => {
      const polylinePoints = route.stops.map(stop => [stop.lat, stop.lng] as [number, number]);
      
      const polyline = L.polyline(polylinePoints, {
        color: route.color,
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1
      });

      polyline.addTo(routeLines.current);
      polyline.bindPopup(`
        <div class="p-3">
          <h3 class="font-semibold text-lg">${route.name}</h3>
          <p class="text-sm text-muted-foreground">Route: ${route.code}</p>
          <p class="text-sm">Distance: ${route.totalDistance} km</p>
          <p class="text-sm">Time: ${route.estimatedTime}</p>
          <p class="text-sm">Arrival:  ${route.arrival}</p>  
          </div>
      `);

      route.stops.forEach((stop, index) => {
        const stopMarker = L.circleMarker([stop.lat, stop.lng], {
          radius: 6,
          fillColor: route.color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        stopMarker.bindPopup(`
          <div class="p-2">
            <h4 class="font-medium">${stop.name}</h4>
            <p class="text-xs text-muted-foreground">Stop ${index + 1} on ${route.name}</p>
          </div>
        `);

        stopMarker.addTo(routeLines.current);
      });
    });
  }, [selectedRoute]);

  // Update bus markers
  useEffect(() => {
    if (!map.current) return;

    busMarkers.current.clearLayers();

    const busesToShow = selectedRoute 
      ? buses.filter(bus => bus.routeId === selectedRoute)
      : buses;

    busesToShow.forEach(bus => {
      const route = dehradunRoutes.find(r => r.id === bus.routeId);
      if (!route) return;

      const busIcon = L.divIcon({
        html: `
          <div class="bus-marker animate-marker-pulse" style="background-color: ${route.color}">
            🚌
          </div>
        `,
        className: 'custom-bus-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon });

      const occupancyPercentage = (bus.occupancy / bus.capacity) * 100;
      const availableSeats = bus.capacity - bus.occupancy;
      const seatStatus = occupancyPercentage >= 90 ? 'Full' : occupancyPercentage >= 70 ? 'Limited' : 'Available';
      const seatStatusColor = occupancyPercentage >= 90 ? '#ef4444' : occupancyPercentage >= 70 ? '#f59e0b' : '#10b981';

      marker.bindPopup(`
        <div class="p-4 min-w-[200px]">
          <h3 class="font-semibold text-lg">${bus.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">Code: ${bus.code}</p>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Route:</span> ${route.name}</p>
            <p><span class="font-medium">Driver:</span> ${bus.driver}</p>
            <p><span class="font-medium">Speed:</span> ${bus.speed} km/h</p>
            <p><span class="font-medium">Next Stop:</span> ${bus.nextStop}</p>
            <p><span class="font-medium">Arrival:</span> ${bus.arrival}</p>

            <p class="flex items-center gap-2">
              <span class="font-medium">Status:</span>
              <span class="px-2 py-1 rounded-full text-xs status-${bus.status}">
                ${bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
              </span>
            </p>
            <div class="mt-2 p-2 bg-gray-50 rounded">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">Seats:</span>
                <span style="color: ${seatStatusColor}; font-weight: bold;">${seatStatus}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" style="width: ${occupancyPercentage}%; background-color: ${seatStatusColor};"></div>
              </div>
              <p class="text-xs mt-1">${availableSeats} of ${bus.capacity} available</p>
            </div>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onBusClick) {
          onBusClick(bus);
        }
      });

      if (selectedBus === bus.id) {
        marker.setZIndexOffset(1000);
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }

      marker.addTo(busMarkers.current);
    });
  }, [selectedRoute, selectedBus, onBusClick, buses]);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add a bot message and speak it if voice call is active
  const addBotMessage = (text: string) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    
    // Speak the message if voice call is active
    if (isVoiceCallActive && synthesisRef.current) {
      setIsBotSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsBotSpeaking(false);
      utterance.onerror = () => setIsBotSpeaking(false);
      synthesisRef.current.speak(utterance);
    }
  };

  // Handle user messages and generate bot responses
  const handleSendMessage = (message?: string) => {
    const text = message || inputMessage;
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
      isVoice: !!message // If message is provided, it's from voice
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate bot response after a short delay
    setTimeout(() => {
      generateBotResponse(text);
    }, 500);
  };

  // Generate appropriate bot response based on user input
  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    let response = '';

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      response = "Hello! I'm SAARTHI assistant. How can I help you with your bus travel today?";
    } else if (input.includes('route') || input.includes('bus')) {
      const routeList = dehradunRoutes.map(route => `- ${route.name} (${route.code})`).join('\n');
      response = `We have these routes available:\n${routeList}\n\nWhich route would you like to book?`;
    } else if (input.includes('book') || input.includes('ticket') || input.includes('reserve')) {
      response = "I can help you book a ticket! Please tell me:\n1. Your starting point\n2. Your destination\n3. Preferred time of travel";
    } else if (input.includes('status') || input.includes('where') || input.includes('location')) {
      response = "I can show you the real-time location of buses. Which route are you interested in?";
    } else if (input.includes('thank') || input.includes('thanks')) {
      response = "You're welcome! Is there anything else I can help you with?";
    } else if (input.includes('price') || input.includes('fare') || input.includes('cost')) {
      response = "Ticket prices vary by distance. Typically, fares range from ₹15 to ₹50 depending on your journey length. Would you like to know the fare for a specific route?";
    } else if (input.includes('time') || input.includes('schedule')) {
      response = "Buses generally run from 6:00 AM to 10:00 PM with frequencies of 15-30 minutes depending on the route. Which route's schedule would you like to see?";
    } else if (input.includes('voice call') || input.includes('call')) {
      response = "I'm activating voice call mode. You can now speak to me directly. How can I help you?";
      setIsVoiceCallActive(true);
    } else if (input.includes('text') || input.includes('type')) {
      response = "Switching to text mode. You can type your questions now.";
      setIsVoiceCallActive(false);
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
    } else {
      response = "I'm here to help with bus routes, bookings, and information. Could you please rephrase your question?";
    }

    addBotMessage(response);
  };

  // Start voice recognition
  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      addBotMessage("Speech recognition is not supported in your browser. Please type your message instead.");
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  // Toggle voice call
  const toggleVoiceCall = () => {
    if (isVoiceCallActive) {
      setIsVoiceCallActive(false);
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel();
      }
      addBotMessage("Voice call ended. You can continue with text chat.");
    } else {
      setIsVoiceCallActive(true);
      addBotMessage("Voice call started. Please speak your question after the beep.");
      
      // Give a short delay before prompting for speech
      setTimeout(() => {
        if (recognitionRef.current) {
          startListening();
        }
      }, 1500);
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="map-container" />
      
      {/* Map overlay with controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="glass p-3 rounded-lg">
          <h3 className="font-semibold text-sm">SAARTHI</h3>
          <p className="text-xs text-muted-foreground">Live locations</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="glass p-3 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Inactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <div className="absolute bottom-7 right-6 z-[1000]">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {showChatbot ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Custom Chatbot Container */}
      {showChatbot && (
        <div className="absolute bottom-20 right-4 z-[1001] w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            <h3 className="font-semibold">SAARTHI Assistant</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleVoiceCall} 
                className={`p-1 rounded-full ${isVoiceCallActive ? 'bg-red-500' : 'bg-green-500'}`}
                title={isVoiceCallActive ? "End voice call" : "Start voice call"}
              >
                {isVoiceCallActive ? <PhoneOff size={16} /> : <Phone size={16} />}
              </button>
              <button onClick={() => setShowChatbot(false)} className="text-white">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.isVoice && (
                      <Mic size={14} className="flex-shrink-0" />
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isListening && (
              <div className="mb-4 flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-sm text-gray-500">Listening...</p>
                  </div>
                </div>
              </div>
            )}
            {isBotSpeaking && (
              <div className="mb-4 flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-sm text-gray-500">Assistant is speaking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex items-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-l-lg ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} ${isVoiceCallActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isVoiceCallActive}
                title={isVoiceCallActive ? "Voice call is active" : (isListening ? "Stop listening" : "Start voice input")}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isVoiceCallActive ? "Voice call active..." : "Type your message..."}
                className="flex-1 border-y border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isVoiceCallActive}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                disabled={isVoiceCallActive}
              >
                <Send size={18} />
              </button>
            </div>
            {isVoiceCallActive && (
              <p className="text-xs text-blue-600 mt-2 text-center">
                Voice call is active. Click the phone icon to end the call.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusMap;