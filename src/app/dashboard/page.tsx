'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const getZodiacSign = (month: number, day: number): string => {
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
  return 'Capricorn';
};

const affirmationPool: Record<string, string[]> = {
  Taurus:
  [
    "You are the rock others rely on.",
    "Strength and stillness live within you.",
    "Your patience is your secret weapon.",
    "Even the storm bends around your calm.",
    "Luxury follows your grounded energy."
  ],
  Aries:
  [
    "You were born to lead, not follow.",
    "Your fire doesnt wait for permission.",
    "Bravery runs through your veins.",
    "You are the spark that lights the way.",
    "Each bold step you take shapes your destiny."
  ],
  Gemini:
  [
    "Your mind moves like lightning.",
    "You speak magic into existence.",
    "Duality is your strength, not a flaw.",
    "New connections bring new clarity.",
    "Ideas are your playground — create freely."
  ],
  Cancer:
  [
    "Your intuition whispers the truth.",
    "Soft doesn’t mean weak — you carry oceans.",
    "Your love is a fortress in a chaotic world.",
    "You heal others just by being present.",
    "Your emotional depth is your superpower."
  ],
  Leo:
  [
    "The sun rises just to see you shine.",
    "Confidence is your crown — wear it.",
    "You inspire others just by being you.",
    "Your warmth lights even the darkest rooms.",
    "You are royalty, even in silence."
  ],
  Virgo:
  [
    "Details matter because you care deeply.",
    "Your clarity brings peace to chaos.",
    "Perfection isn’t pressure — it’s purpose.",
    "You find order in the messiest places.",
    "Quiet excellence is your legacy."
  ],
  Libra:
  [
    "You bring harmony where others see war.",
    "Balance isn’t just your goal — it’s your gift.",
    "Your heart and mind walk hand in hand.",
    "Your beauty lies in your fairness.",
    "Peace surrounds you because you create it."
  ],
  Scorpio:
  [
    "Mystery isn't a mask — it's your nature.",
    "You transform pain into power.",
    "You see beneath the surface with ease.",
    "Your intensity is your truth.",
    "Others trust you because you’re fearless."
  ],
  Sagittarius:
  [
    "The horizon calls your name.",
    "Adventure is written in your soul.",
    "Your curiosity knows no borders.",
    "Freedom fuels your fire.",
    "You inspire others to explore their truth."
  ],
  Capricorn:
  [
  "You were built for the climb.",
  "Your discipline shapes worlds.",
  "Success is drawn to your focus.",
  "You don’t just dream — you build.",
  "Others follow where you lead in silence."
  ],
  Aquarius:
  [
    "You are the change the world waits for.",
    "Your mind creates futures no one sees yet.",
    "You don’t fit in — you’re meant to stand out.",
    "Your ideas ripple across generations.",
    "The rebel in you is the healer in disguise."
  ]
};




export default function Dashboard() {
  const router = useRouter();
  
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [tob, setTob] = useState('');
  const [place, setPlace] = useState('');

  useEffect(() => {
    // Get token from localStorage
    const jwt = localStorage.getItem('token');
    
    if (!jwt) {
    router.push('/auth/login');
    return;
    }
 
    // Decode base64 to original token
      try {
        const decoded = atob(jwt);
        console.log( "decoded back to jwt",decoded);
      } catch (err) {
        console.error("Token decode error:", err);
        router.push('/auth/login');
      }

  }, [router]);

  const getAffirmation = (sign: string) => {
  const pool = affirmationPool[sign] || ["You are unique and powerful."];
  const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
  return `You are a ${sign}. ${selected.join(' ')}`;
};

  const handleSubmit = async(e: React.FormEvent) => 
  {

    e.preventDefault();
    if (!dobDate || !tob || !place) return;

    try {
      // 1. Convert place to lat/lon using OpenCage
      const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${process.env.NEXT_PUBLIC_GEOCODE_API_KEY}&pretty=1&no_annotations=1`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("Location not found. Try being more specific.");
        return;
      }
      console.log(geoData);

      //const { lat, lng } = geoData.results[0].geometry;

      // 2. Extract birth data
      const birthDate = new Date(dobDate);
      const day = birthDate.getUTCDate();
      const month = birthDate.getUTCMonth() + 1;
      // const year = birthDate.getUTCFullYear();
      // const [hourStr, minStr] = tob.split(':');
      // const hour = parseInt(hourStr);
      // const min = parseInt(minStr);

      // 3. Prepare payload for VedicRishi
      // const astroPayload = {
      // day,
      // month,
      // year,
      // hour,
      // min,
      // lat,
      // lon: lng,
      // tzone: 5.5, // hardcoded IST for now
      // };

      // const astroRes = await fetch('', {
      // method: 'POST',
      // // headers: {
      // //   'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_ASTRO_USER_ID}:${process.env.NEXT_PUBLIC_ASTRO_API_KEY}`),
      // //   'Content-Type': 'application/json'
      // // },
      // //body: JSON.stringify(astroPayload)
      // });

      const sign = getZodiacSign(month, day);
      const finalMessage = getAffirmation(sign);
      localStorage.setItem("finalHoroscope", finalMessage);
      router.push("/result");
    }
    catch (err) 
    {
      console.error("Error:", err);
      alert("Something went wrong. Try again.");
    }}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-700">🔮 Horoscope Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
  <DatePicker
    selected={dobDate}
    onChange={(date) => setDobDate(date)}
    dateFormat="yyyy-MM-dd"
    placeholderText="Select your birth date"
    className="w-full p-2 border rounded-md focus:ring focus:border-indigo-400"
    showYearDropdown
    scrollableYearDropdown
    yearDropdownItemNumber={100}
    maxDate={new Date()}
  />
          <input
            type="time"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:border-indigo-400"
            placeholder="Time of Birth"
          />
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:border-indigo-400"
            placeholder="Place of Birth"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Generate Horoscope
          </button>
        </form>
      </div>
    </div>
  );
}