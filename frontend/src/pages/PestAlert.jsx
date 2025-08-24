import React, { useState } from 'react'
import { AlertTriangle, Bug, Shield, Search, Filter, Eye, Zap } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

// Pest data for different crops
const pestData = {
  rice: {
    name: { en: 'Rice', hi: 'चावल', ml: 'അരി' },
    pests: [
      {
        name: { en: 'Brown Planthopper', hi: 'भूरा फुदका', ml: 'ബ്രൗൺ പ്ലാന്റ്ഹോപ്പർ' },
        severity: 'high',
        symptoms: { 
          en: 'Yellow to brown leaves, stunted growth, honeydew secretion',
          hi: 'पत्तियों का पीला से भूरा होना, विकास रुकना, शहद जैसा स्राव',
          ml: 'ഇലകൾ മഞ്ഞയിൽ നിന്ന് തവിട്ട് നിറമാകുക, വളർച്ച മുരടിക്കുക'
        },
        prevention: {
          en: 'Use resistant varieties, maintain proper spacing, avoid excessive nitrogen',
          hi: 'प्रतिरोधी किस्मों का उपयोग, उचित दूरी बनाए रखें, अधिक नाइट्रोजन से बचें',
          ml: 'പ്രതിരോധശേഷിയുള്ള ഇനങ്ങൾ ഉപയോഗിക്കുക, ശരിയായ അകലം പാലിക്കുക'
        },
        treatment: {
          en: 'Apply insecticides like imidacloprid, thiamethoxam',
          hi: 'इमिडाक्लोप्रिड, थियामेथोक्साम जैसे कीटनाशकों का प्रयोग करें',
          ml: 'ഇമിഡാക്ലോപ്രിഡ്, തിയമെത്തോക്സാം എന്നീ കീടനാശിനികൾ ഉപയോഗിക്കുക'
        }
      },
      {
        name: { en: 'Stem Borer', hi: 'तना बेधक', ml: 'തണ്ട് തുരപ്പൻ' },
        severity: 'medium',
        symptoms: { 
          en: 'Dead heart, white heads, holes in stem',
          hi: 'मृत हृदय, सफेद सिर, तने में छेद',
          ml: 'ഡെഡ് ഹാർട്ട്, വെള്ള തല, തണ്ടിൽ ദ്വാരങ്ങൾ'
        },
        prevention: {
          en: 'Early planting, destroy stubbles, use pheromone traps',
          hi: 'जल्दी बुवाई, ठूंठ नष्ट करें, फेरोमोन ट्रैप का उपयोग',
          ml: 'നേരത്തെ നടൽ, അവശിഷ്ടങ്ങൾ നശിപ്പിക്കുക, ഫെറോമോൺ കെണികൾ ഉപയോഗിക്കുക'
        },
        treatment: {
          en: 'Apply carbofuran, chlorpyrifos at proper timing',
          hi: 'उचित समय पर कार्बोफुरान, क्लोरपायरीफॉस का प्रयोग',
          ml: 'ശരിയായ സമയത്ത് കാർബോഫുറാൻ, ക്ലോർപൈരിഫോസ് പ്രയോഗിക്കുക'
        }
      }
    ]
  },
  wheat: {
    name: { en: 'Wheat', hi: 'गेहूं', ml: 'ഗോതമ്പ്' },
    pests: [
      {
        name: { en: 'Aphids', hi: 'माहू', ml: 'എഫിഡ്സ്' },
        severity: 'medium',
        symptoms: { 
          en: 'Yellowing leaves, stunted growth, honeydew on leaves',
          hi: 'पत्तियों का पीला होना, विकास रुकना, पत्तियों पर शहद जैसा पदार्थ',
          ml: 'ഇലകൾ മഞ്ഞയാകുക, വളർച്ച മുരടിക്കുക, ഇലകളിൽ തേൻ പോലെ ദ്രവം'
        },
        prevention: {
          en: 'Early sowing, remove weeds, use reflective mulch',
          hi: 'जल्दी बुवाई, खरपतवार हटाएं, प्रतिबिंबित मल्च का उपयोग',
          ml: 'നേരത്തെ വിതയ്ക്കുക, കളകൾ നീക്കം ചെയ്യുക, പ്രതിഫലന മൾച്ച് ഉപയോഗിക്കുക'
        },
        treatment: {
          en: 'Spray dimethoate, malathion insecticides',
          hi: 'डाइमेथोएट, मैलाथियान कीटनाशकों का छिड़काव',
          ml: 'ഡൈമെത്തോയേറ്റ്, മലാത്തിയോൺ കീടനാശിനികൾ തളിക്കുക'
        }
      },
      {
        name: { en: 'Termites', hi: 'दीमक', ml: 'ചിതൽ' },
        severity: 'high',
        symptoms: { 
          en: 'Wilting, yellowing, plant death, mud tubes',
          hi: 'मुरझाना, पीला होना, पौधे की मृत्यु, मिट्टी की नलियां',
          ml: 'വാടൽ, മഞ്ഞയാകൽ, ചെടി മരണം, മണ്ണ് കുഴലുകൾ'
        },
        prevention: {
          en: 'Soil treatment before sowing, remove crop residues',
          hi: 'बुवाई से पहले मिट्टी का उपचार, फसल अवशेष हटाएं',
          ml: 'വിതയ്ക്കുന്നതിന് മുമ്പ് മണ്ണ് ചികിത്സ, വിള അവശിഷ്ടങ്ങൾ നീക്കം ചെയ്യുക'
        },
        treatment: {
          en: 'Apply chlorpyrifos, fipronil in soil',
          hi: 'मिट्टी में क्लोरपायरीफॉस, फिप्रोनिल का प्रयोग',
          ml: 'മണ്ണിൽ ക്ലോർപൈരിഫോസ്, ഫിപ്രോണിൽ പ്രയോഗിക്കുക'
        }
      }
    ]
  },
  maize: {
    name: { en: 'Maize', hi: 'मक्का', ml: 'ചോളം' },
    pests: [
      {
        name: { en: 'Fall Armyworm', hi: 'फॉल आर्मीवर्म', ml: 'ഫാൾ ആർമിവേം' },
        severity: 'high',
        symptoms: { 
          en: 'Holes in leaves, damaged growing points, frass in whorl',
          hi: 'पत्तियों में छेद, बढ़ते बिंदुओं को नुकसान, कुंडली में मल',
          ml: 'ഇലകളിൽ ദ്വാരങ്ങൾ, വളരുന്ന പോയിന്റുകൾക്ക് കേടുപാടുകൾ'
        },
        prevention: {
          en: 'Early planting, intercropping, pheromone traps',
          hi: 'जल्दी बुवाई, अंतर-फसल, फेरोमोन ट्रैप',
          ml: 'നേരത്തെ നടൽ, ഇടവിള, ഫെറോമോൺ കെണികൾ'
        },
        treatment: {
          en: 'Apply chlorantraniliprole, spinetoram insecticides',
          hi: 'क्लोरैंट्रानिलिप्रोल, स्पिनेटोरम कीटनाशकों का प्रयोग',
          ml: 'ക്ലോറാന്ത്രാനിലിപ്രോൾ, സ്പിനെറ്റോറാം കീടനാശിനികൾ പ്രയോഗിക്കുക'
        }
      }
    ]
  },
  sugarcane: {
    name: { en: 'Sugarcane', hi: 'गन्ना', ml: 'കരിമ്പ്' },
    pests: [
      {
        name: { en: 'Sugarcane Borer', hi: 'गन्ना बेधक', ml: 'കരിമ്പ് തുരപ്പൻ' },
        severity: 'high',
        symptoms: { 
          en: 'Holes in internodes, dead hearts, reduced sugar content',
          hi: 'अंतर्गांठों में छेद, मृत हृदय, चीनी की मात्रा में कमी',
          ml: 'ഇന്റർനോഡുകളിൽ ദ്വാരങ്ങൾ, ഡെഡ് ഹാർട്ട്, പഞ്ചസാരയുടെ അളവ് കുറയൽ'
        },
        prevention: {
          en: 'Use healthy seed cane, destroy infested stubbles',
          hi: 'स्वस्थ बीज गन्ने का उपयोग, संक्रमित ठूंठ नष्ट करें',
          ml: 'ആരോഗ്യകരമായ വിത്ത് കരിമ്പ് ഉപയോഗിക്കുക, രോഗബാധിതമായ അവശിഷ്ടങ്ങൾ നശിപ്പിക്കുക'
        },
        treatment: {
          en: 'Apply carbofuran granules, release parasitoids',
          hi: 'कार्बोफुरान दाने डालें, परजीवी छोड़ें',
          ml: 'കാർബോഫുറാൻ ഗ്രാന്യൂളുകൾ പ്രയോഗിക്കുക, പരാന്നജീവികൾ വിട്ടയയ്ക്കുക'
        }
      }
    ]
  }
}

const PestAlert = () => {
  const { t, currentLanguage } = useLanguage()
  const [selectedCrop, setSelectedCrop] = useState('rice')
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')

  const currentCrop = pestData[selectedCrop]
  const filteredPests = currentCrop.pests.filter(pest => {
    const matchesSearch = pest.name[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || pest.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 via-red-500/20 to-pink-600/20 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center animate-glow">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                {t('pestAlert')}
              </h1>
              <p className="text-slate-400 mt-2">
                {t('pestKnowledgeBase')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Crop Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Bug className="h-5 w-5 mr-2 text-orange-400" />
              Select Crop
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(pestData).map(([key, crop]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCrop(key)}
                  className={`p-3 rounded-xl transition-all duration-200 text-sm ${
                    selectedCrop === key
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300'
                      : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border border-slate-600/30'
                  }`}
                >
                  {crop.name[currentLanguage]}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-400" />
              Search Pest
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by pest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              />
            </div>
          </div>

          {/* Severity Filter */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2 text-purple-400" />
              Filter by Severity
            </h3>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            >
              <option value="all">All Severities</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Pest List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {currentCrop.name[currentLanguage]} Pests ({filteredPests.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>🔴 High</span>
              <span>🟡 Medium</span>
              <span>🟢 Low</span>
            </div>
          </div>

          {filteredPests.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 text-center">
              <Bug className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">
                {searchTerm || severityFilter !== 'all' 
                  ? 'No pests found matching your criteria'
                  : 'No pest data available for this crop'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPests.map((pest, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
                >
                  {/* Pest Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                        <span className="mr-2">{getSeverityIcon(pest.severity)}</span>
                        {pest.name[currentLanguage]}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(pest.severity)}`}>
                        {pest.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                  </div>

                  {/* Symptoms */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-blue-400" />
                      Symptoms
                    </h4>
                    <p className="text-sm text-slate-400">
                      {pest.symptoms[currentLanguage]}
                    </p>
                  </div>

                  {/* Prevention */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-400" />
                      Prevention
                    </h4>
                    <p className="text-sm text-slate-400">
                      {pest.prevention[currentLanguage]}
                    </p>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                      Treatment
                    </h4>
                    <p className="text-sm text-slate-400">
                      {pest.treatment[currentLanguage]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PestAlert
