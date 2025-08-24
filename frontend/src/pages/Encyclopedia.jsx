import React, { useState } from 'react'
import { Database, Search, Book, Wrench, Sprout, Beaker, Bug, Droplets, Sun } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const encyclopediaData = {
  crops: {
    icon: Sprout,
    color: 'from-green-500 to-emerald-600',
    title: { en: 'Crops', hi: 'फसलें', ml: 'വിളകൾ' },
    items: {
      rice: {
        name: { en: 'Rice', hi: 'चावल', ml: 'നെല്ല്' },
        description: {
          en: 'Staple food crop grown in flooded fields. High water requirement.',
          hi: 'जलमग्न खेतों में उगाई जाने वाली मुख्य खाद्य फसल। अधिक पानी की आवश्यकता।',
          ml: 'വെള്ളത്തിൽ മുങ്ങിയ വയലുകളിൽ വളർത്തുന്ന പ്രധാന ഭക്ഷ്യവിള. ഉയർന്ന ജല ആവശ്യകത.'
        },
        details: {
          en: ['Duration: 120-150 days', 'Water: High requirement', 'Soil: Clay loam preferred'],
          hi: ['अवधि: 120-150 दिन', 'पानी: अधिक आवश्यकता', 'मिट्टी: चिकनी दोमट उपयुक्त'],
          ml: ['കാലാവധി: 120-150 ദിവസം', 'വെള്ളം: ഉയർന്ന ആവശ്യകത', 'മണ്ണ്: കളിമണ്ണ് അനുയോജ്യം']
        }
      },
      wheat: {
        name: { en: 'Wheat', hi: 'गेहूं', ml: 'ഗോതമ്പ്' },
        description: {
          en: 'Cool season cereal crop. Major source of flour for bread making.',
          hi: 'ठंडे मौसम की अनाज फसल। रोटी बनाने के लिए आटे का मुख्य स्रोत।',
          ml: 'തണുത്ത കാലാവസ്ഥയിലെ ധാന്യവിള. റൊട്ടി നിർമ്മാണത്തിനുള്ള മാവിന്റെ പ്രധാന സ്രോതസ്സ്.'
        },
        details: {
          en: ['Duration: 120-150 days', 'Temperature: 15-25°C', 'Soil: Well-drained loam'],
          hi: ['अवधि: 120-150 दिन', 'तापमान: 15-25°C', 'मिट्टी: अच्छी जल निकासी वाली दोमट'],
          ml: ['കാലാവധി: 120-150 ദിവസം', 'താപനിലയ്: 15-25°C', 'മണ്ണ്: നല്ല ജലനിർഗമനമുള്ള പശിമരാശി']
        }
      }
    }
  },
  tools: {
    icon: Wrench,
    color: 'from-blue-500 to-indigo-600',
    title: { en: 'Tools & Equipment', hi: 'उपकरण', ml: 'ഉപകരണങ്ങൾ' },
    items: {
      tractor: {
        name: { en: 'Tractor', hi: 'ट्रैक्टर', ml: 'ട്രാക്ടർ' },
        description: {
          en: 'Primary power source for modern farming operations.',
          hi: 'आधुनिक कृषि कार्यों के लिए मुख्य शक्ति स्रोत।',
          ml: 'ആധുനിക കാർഷിക പ്രവർത്തനങ്ങൾക്കുള്ള പ്രധാന ശക്തി സ്രോതസ്സ്.'
        },
        details: {
          en: ['Used for: Plowing, cultivation, transport', 'Power: 25-100+ HP', 'Fuel: Diesel/Electric'],
          hi: ['उपयोग: जुताई, खेती, परिवहन', 'शक्ति: 25-100+ HP', 'ईंधन: डीजल/विद्युत'],
          ml: ['ഉപയോഗം: ഉഴൽ, കൃഷി, ഗതാഗതം', 'ശക്തി: 25-100+ HP', 'ഇന്ധനം: ഡീസൽ/വൈദ്യുതി']
        }
      },
      plow: {
        name: { en: 'Plow', hi: 'हल', ml: 'കലപ്പ' },
        description: {
          en: 'Tool for breaking and turning soil for crop preparation.',
          hi: 'फसल की तैयारी के लिए मिट्टी तोड़ने और पलटने का उपकरण।',
          ml: 'വിള തയ്യാറാക്കലിനായി മണ്ണ് തകർത്ത് മറിക്കുന്ന ഉപകരണം.'
        },
        details: {
          en: ['Types: Moldboard, Disc, Chisel', 'Depth: 15-30 cm', 'Speed: 4-8 km/h'],
          hi: ['प्रकार: मोल्डबोर्ड, डिस्क, छेनी', 'गहराई: 15-30 सेमी', 'गति: 4-8 किमी/घंटा'],
          ml: ['തരങ്ങൾ: മോൾഡ്ബോർഡ്, ഡിസ്ക്, ചിസൽ', 'ആഴം: 15-30 സെമി', 'വേഗത: 4-8 കിമി/മണിക്കൂർ']
        }
      }
    }
  },
  fertilizers: {
    icon: Beaker,
    color: 'from-purple-500 to-violet-600',
    title: { en: 'Fertilizers', hi: 'उर्वरक', ml: 'വളങ്ങൾ' },
    items: {
      urea: {
        name: { en: 'Urea', hi: 'यूरिया', ml: 'യൂറിയ' },
        description: {
          en: 'High nitrogen fertilizer for vegetative growth.',
          hi: 'वानस्पतिक वृद्धि के लिए उच्च नाइट्रोजन उर्वरक।',
          ml: 'വൃദ്ധിക്കുള്ള ഉയർന്ന നൈട്രജൻ വളം.'
        },
        details: {
          en: ['N content: 46%', 'Application: Split doses', 'Rate: 100-150 kg/ha'],
          hi: ['N मात्रा: 46%', 'प्रयोग: विभाजित खुराक', 'दर: 100-150 किग्रा/हेक्टेयर'],
          ml: ['N ഉള്ളടക്കം: 46%', 'പ്രയോഗം: വിഭജിത അളവുകൾ', 'നിരക്ക്: 100-150 കിലോ/ഹെക്ടർ']
        }
      },
      dap: {
        name: { en: 'DAP', hi: 'डी.ए.पी.', ml: 'ഡി.എ.പി' },
        description: {
          en: 'Diammonium phosphate - provides nitrogen and phosphorus.',
          hi: 'डायअमोनियम फास्फेट - नाइट्रोजन और फास्फोरस प्रदान करता है।',
          ml: 'ഡയമോണിയം ഫോസ്ഫേറ്റ് - നൈട്രജനും ഫോസ്ഫറസും നൽകുന്നു.'
        },
        details: {
          en: ['N: 18%, P: 46%', 'Application: Basal dose', 'Rate: 100-125 kg/ha'],
          hi: ['N: 18%, P: 46%', 'प्रयोग: बेसल डोज़', 'दर: 100-125 किग्रा/हेक्टेयर'],
          ml: ['N: 18%, P: 46%', 'പ്രയോഗം: അടിവളം', 'നിരക്ക്: 100-125 കിലോ/ഹെക്ടർ']
        }
      }
    }
  },
  irrigation: {
    icon: Droplets,
    color: 'from-cyan-500 to-blue-600',
    title: { en: 'Irrigation', hi: 'सिंचाई', ml: 'ജലസേചനം' },
    items: {
      drip: {
        name: { en: 'Drip Irrigation', hi: 'ड्रिप सिंचाई', ml: 'ഡ്രിപ് ജലസേചനം' },
        description: {
          en: 'Water-efficient irrigation system delivering water directly to roots.',
          hi: 'जड़ों तक सीधे पानी पहुंचाने वाली जल कुशल सिंचाई प्रणाली।',
          ml: 'വേരുകളിലേക്ക് നേരിട്ട് വെള്ളം എത്തിക്കുന്ന ജല കാര്യക്ഷമമായ സേചന സംവിധാനം.'
        },
        details: {
          en: ['Efficiency: 90-95%', 'Suitable for: All crops', 'Benefits: Water saving, weed control'],
          hi: ['दक्षता: 90-95%', 'उपयुक्त: सभी फसलों के लिए', 'लाभ: पानी की बचत, खरपतवार नियंत्रण'],
          ml: ['കാര്യക്ഷമത: 90-95%', 'അനുയോജ്യം: എല്ലാ വിളകൾക്കും', 'ഗുണങ്ങൾ: ജല ലാഭം, കള നിയന്ത്രണം']
        }
      },
      sprinkler: {
        name: { en: 'Sprinkler System', hi: 'स्प्रिंकलर सिस्टम', ml: 'സ്പ്രിങ്ക്ലർ സിസ്റ്റം' },
        description: {
          en: 'Overhead irrigation system mimicking natural rainfall.',
          hi: 'प्राकृतिक बारिश की नकल करने वाली ऊपरी सिंचाई प्रणाली।',
          ml: 'പ്രകൃതിദത്ത മഴയെ അനുകരിക്കുന്ന മുകളിൽനിന്നുള്ള സേചന സംവിധാനം.'
        },
        details: {
          en: ['Efficiency: 75-85%', 'Coverage: Large areas', 'Suitable for: Field crops'],
          hi: ['दक्षता: 75-85%', 'कवरेज: बड़े क्षेत्र', 'उपयुक्त: खेत की फसलों के लिए'],
          ml: ['കാര്യക്ഷമത: 75-85%', 'കവറേജ്: വിശാലമായ പ്രദേശങ്ങൾ', 'അനുയോജ്യം: വയൽവിളകൾക്ക്']
        }
      }
    }
  }
}

const Encyclopedia = () => {
  const { t, currentLanguage } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('crops')
  const [searchTerm, setSearchTerm] = useState('')

  const currentCategory = encyclopediaData[selectedCategory]
  const filteredItems = Object.entries(currentCategory.items).filter(([key, item]) =>
    item.name[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description[currentLanguage].toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 via-purple-500/20 to-indigo-600/20 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center animate-glow">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                {t('encyclopedia')}
              </h1>
              <p className="text-slate-400 mt-2">
                {t('farmingKnowledgeBase')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-400" />
                Search
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-purple-400" />
                Categories
              </h3>
              <div className="space-y-2">
                {Object.entries(encyclopediaData).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full p-3 rounded-xl transition-all duration-200 text-left ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 border border-slate-600/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <category.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{category.title[currentLanguage]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentCategory.color} flex items-center justify-center mr-3`}>
                  <currentCategory.icon className="h-5 w-5 text-white" />
                </div>
                {currentCategory.title[currentLanguage]} ({filteredItems.length})
              </h2>

              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {searchTerm ? 'No items found matching your search' : 'No items available'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map(([key, item]) => (
                    <div
                      key={key}
                      className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200"
                    >
                      <h3 className="text-xl font-bold text-white mb-3">
                        {item.name[currentLanguage]}
                      </h3>
                      <p className="text-slate-300 text-sm mb-4">
                        {item.description[currentLanguage]}
                      </p>
                      <div className="space-y-2">
                        {item.details[currentLanguage].map((detail, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                            <span className="text-slate-400 text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Encyclopedia
