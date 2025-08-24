import React from 'react'
import { Lightbulb, Sprout, Droplets, Sun, Shield, Leaf, Zap, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const tips = [
  {
    icon: Sprout,
    color: 'from-emerald-500 to-green-600',
    title: {
      en: 'Soil Preparation',
      hi: 'मिट्टी की तैयारी',
      ml: 'മണ്ണിന്റെ തയ്യാറാക്കല്'
    },
    points: {
      en: [
        'Test soil pH and nutrients before sowing',
        'Add organic matter like compost or FYM',
        'Ensure proper tillage for good root aeration'
      ],
      hi: [
        'बुवाई से पहले मिट्टी का pH और पोषक तत्व जाँचें',
        'कम्पोस्ट या गोबर खाद मिलाएँ',
        'जड़ों के लिए उचित जुताई करें'
      ],
      ml: [
        'വിതയ്ക്കുന്നതിന് മുമ്പ് മണ്ണിലെ pHയും പോഷകങ്ങളും പരിശോധിക്കുക',
        'കമ്പോസ്റ്റ് അല്ലെങ്കിൽ എഫ്.വൈ. എം ചേർക്കുക',
        'വേരുകളുടെ വായുസഞ്ചാരത്തിനായി ശരിയായ ഉഴവ് ഉറപ്പാക്കുക'
      ]
    }
  },
  {
    icon: Droplets,
    color: 'from-blue-500 to-indigo-600',
    title: {
      en: 'Irrigation Management',
      hi: 'सिंचाई प्रबंधन',
      ml: 'ജലസേചന നിയന്ത്രണം'
    },
    points: {
      en: [
        'Irrigate based on crop stage and soil moisture',
        'Use mulching to conserve water',
        'Prefer drip/sprinkler for efficiency'
      ],
      hi: [
        'फसल की अवस्था और मिट्टी की नमी के अनुसार सिंचाई करें',
        'पानी बचाने के लिए मल्चिंग करें',
        'दक्षता के लिए ड्रिप/स्प्रिंकलर का उपयोग करें'
      ],
      ml: [
        'വിളയുടെ ഘട്ടം, മണ്ണിലെ ഈർപ്പം എന്നിവയെ ആശ്രയിച്ച് ജലസേചനം നടത്തുക',
        'വെള്ളം സംരക്ഷിക്കാൻ മൾച്ചിംഗ് ഉപയോഗിക്കുക',
        'കാര്യക്ഷമതയ്ക്ക് ഡ്രിപ്പ്/സ്പ്രിങ്ക്ലർ പ്രാധാന്യം നൽകുക'
      ]
    }
  },
  {
    icon: Sun,
    color: 'from-yellow-500 to-orange-600',
    title: {
      en: 'Crop Nutrition',
      hi: 'फसल पोषण',
      ml: 'വിള പോഷണം'
    },
    points: {
      en: [
        'Follow soil test-based fertilizer recommendation',
        'Split nitrogen doses for better uptake',
        'Use biofertilizers to boost soil health'
      ],
      hi: [
        'मिट्टी परीक्षण आधारित उर्वरक सिफारिशें अपनाएं',
        'नाइट्रोजन की खुराक विभाजित करें',
        'जैविक उर्वरकों का उपयोग करें'
      ],
      ml: [
        'മണ്ണ് പരിശോധനയെ അടിസ്ഥാനമാക്കിയുള്ള വള ശുപാർശകൾ പിന്തുടരുക',
        'നൈട്രജൻ വിഭജിക്കപ്പെട്ട അളവുകളിൽ നൽകുക',
        'മണ്ണിന്റെ ആരോഗ്യത്തിന് ജൈവവളങ്ങൾ പ്രയോജനപ്പെടുത്തുക'
      ]
    }
  },
  {
    icon: Shield,
    color: 'from-pink-500 to-rose-600',
    title: {
      en: 'Pest & Disease',
      hi: 'कीट और रोग',
      ml: 'കീടവും രോഗവും'
    },
    points: {
      en: [
        'Monitor fields weekly for early detection',
        'Use resistant varieties and crop rotation',
        'Apply pesticides only as per threshold'
      ],
      hi: [
        'जल्दी पहचान के लिए साप्ताहिक निगरानी करें',
        'प्रतिरोधी किस्में और फसल चक्र अपनाएं',
        'कीटनाशक केवल सीमा के अनुसार दें'
      ],
      ml: [
        'ലഘുവായ ഘട്ടത്തിൽ കണ്ടെത്താൻ ആഴ്ചതോറും നിരീക്ഷിക്കുക',
        'പ്രതിരോധ ഇനങ്ങളും വിള പരിവർത്തനവും സ്വീകരിക്കുക',
        'പരിധി അടിസ്ഥാനത്തിൽ മാത്രം കീടനാശിനികൾ പ്രയോഗിക്കുക'
      ]
    }
  },
  {
    icon: Leaf,
    color: 'from-lime-500 to-green-600',
    title: {
      en: 'Sustainable Practices',
      hi: 'टिकाऊ उपाय',
      ml: 'സുസ്ഥിര പദ്ധതികൾ'
    },
    points: {
      en: [
        'Adopt intercropping and cover crops',
        'Conserve water and soil',
        'Recycle farm residues'
      ],
      hi: [
        'अंतर-फसल और कवर फसल अपनाएं',
        'पानी और मिट्टी का संरक्षण करें',
        'कृषि अवशेषों का पुनर्चक्रण करें'
      ],
      ml: [
        'ഇടവിളയും മൂടിവിളയും സ്വീകരിക്കുക',
        'ജലവും മണ്ണും സംരക്ഷിക്കുക',
        'കൃഷി അവശിഷ്ടങ്ങൾ പുനരുപയോഗിക്കുക'
      ]
    }
  }
]

const FarmingTips = () => {
  const { t, currentLanguage } = useLanguage()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="bg-gradient-to-r from-cyan-600/20 via-teal-500/20 to-emerald-600/20 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-600 rounded-2xl flex items-center justify-center animate-glow">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">{t('farmingTips')}</h1>
              <p className="text-slate-400 mt-2">{t('practicalFarmingAdvice')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4`}>
                <tip.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tip.title[currentLanguage]}</h3>
              <ul className="space-y-2">
                {tip.points[currentLanguage].map((p, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1" />
                    <span className="text-slate-300 text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmingTips

