import React, { useState } from 'react';
import Card from '../components/Card';
import { TrendingUp, Users, Search, ExternalLink } from 'lucide-react';
import careersData from '../data/careers.json';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Software Development', 'AI & Data', 'Cloud & DevOps', 'Marketing', 'Design', 'Security'];

  const filteredCareers = careersData.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Career Pathways</h1>
        <p className="text-gray-600 dark:text-gray-400">Explore exciting career opportunities and find your perfect path</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Career Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map(career => (
          <Card key={career.id} className="p-6" hover>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{career.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 rounded-full">
                    {career.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{career.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-lg mr-2">₹</span>
                  <span>Average Salary: <span className="font-medium text-gray-900 dark:text-white">{career.averageSalary}</span></span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>Growth Rate: <span className="font-medium text-green-600 dark:text-green-400">{career.growthRate}</span></span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {career.requiredSkills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {career.requiredSkills.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      +{career.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                {career.resources && career.resources.length > 0 ? (
                  career.resources.map((resource, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        window.open(resource.url, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <span>{resource.title}</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  ))
                ) : (
                  <button 
                    onClick={() => {
                      // Fallback to Coursera search if no resources
                      const careerUrl = `https://www.coursera.org/search?query=${encodeURIComponent(career.title + ' career path')}`;
                      window.open(careerUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Explore Career Path</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No careers found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
};

export default Careers;
