import React, { useState } from 'react';
import Card from '../components/Card';
import { CheckCircle, Clock, Target, Filter, ExternalLink, Search } from 'lucide-react';
import skillsData from '../data/skills.json';
import { getSkillResourceUrl } from '../data/skillResources';

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Programming', 'Frontend', 'Analytics', 'AI/ML', 'Cloud', 'Database', 'Design', 'Marketing', 'Security'];
  const priorities = ['All', 'high', 'medium', 'low'];

  const filteredSkills = skillsData.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || skill.priority === selectedPriority;
    const matchesSearch = searchTerm === '' || skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  // Handle custom skill search
  const handleCustomSkillSearch = (skillName) => {
    if (skillName.trim()) {
      const learningUrl = getSkillResourceUrl(skillName);
      window.open(learningUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/10';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/10';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Skill Recommendations</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your progress and discover new skills to advance your career</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Skills</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillsData.filter(skill => skill.isCompleted).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillsData.filter(skill => !skill.isCompleted && skill.progress > 0).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {skillsData.filter(skill => skill.priority === 'high').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar for Custom Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Any Skill to Learn
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Enter any skill name (e.g., TypeScript, Docker, Kubernetes...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim() && !filteredSkills.some(s => s.name.toLowerCase() === searchTerm.toLowerCase())) {
                      handleCustomSkillSearch(searchTerm);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {searchTerm.trim() && !filteredSkills.some(s => s.name.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                  onClick={() => handleCustomSkillSearch(searchTerm)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <span>Learn</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchTerm && filteredSkills.length === 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No matching skills found. Click "Learn" to search for learning resources for "{searchTerm}"
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'All' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map(skill => {
          const learningUrl = getSkillResourceUrl(skill.name);
          
          const handleLearnClick = () => {
            window.open(learningUrl, '_blank', 'noopener,noreferrer');
          };
          
          return (
            <Card key={skill.id} className="p-6" hover>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                    {skill.isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(skill.priority)}`}>
                    {skill.priority.charAt(0).toUpperCase() + skill.priority.slice(1)}
                  </span>
                </div>


                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {skill.category}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {skill.estimatedTime}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    onClick={handleLearnClick}
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <span>{skill.isCompleted ? 'Review Skill' : 'Continue Learning'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
