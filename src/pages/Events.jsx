import React, { useState } from 'react';
import Card from '../components/Card';
import { Calendar, MapPin, Users, Clock, Star, Video } from 'lucide-react';
import eventsData from '../data/events.json';
import mentorsData from '../data/mentors.json';

const Events = () => {
  const [activeTab, setActiveTab] = useState('events');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Career Fair': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'Workshop': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'Networking': return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300';
      case 'Competition': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAvailabilityStatus = (availability) => {
    return availability === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events & Mentorship</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover networking opportunities and connect with industry experts</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'mentors'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Find Mentors
          </button>
        </nav>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventsData.map(event => (
            <Card key={event.id} className="p-6" hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    {event.isVirtual ? <Video className="h-4 w-4 mr-2 flex-shrink-0" /> : <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />}
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{event.attendees} attendees expected</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                    Register Now
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorsData.map(mentor => (
            <Card key={mentor.id} className="p-6" hover>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{mentor.company}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mentor.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({mentor.sessions} sessions)</span>
                  </div>
                  <span className={`text-sm font-medium ${getAvailabilityStatus(mentor.availability)}`}>
                    {mentor.availability}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      mentor.availability === 'Available'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={mentor.availability !== 'Available'}
                  >
                    {mentor.availability === 'Available' ? 'Book Session' : 'Not Available'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
