"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../Lib/fireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import "./styles.css"

export default function SignUpPage() {
    //Router for navigating to next page
    const router = useRouter();
    
    //data to be collected from the users
    const [form, setForm] = useState({
        name: '',
        dob: '',
       // tob: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const userCred=await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            await updateProfile(userCred.user,{
                displayName: form.name
            })

            //Saving the other data to firestore which 
            //isnt required at the moment
            await setDoc(doc(db,'users',userCred.user.uid),{
                name:form.name,
                dob:form.dob,
            //    tob:form.tob,
                email:form.email,
                createdAt: new Date().toISOString(),
            })

            router.push("/auth/login")
        }catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong.');
            }
        }
        setLoading(false);
    }

   return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-purple-200">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-purple-700">Sign Up</h2>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={onnChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-purple-400"
                />

                <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={onnChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-purple-400"
                />

                {/*<input
                type="time"
                name="tob"
                value={form.tob}
                onChange={onnChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-purple-400"
                />*/}

                <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={onnChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-purple-400"
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onnChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-purple-400"
                />

                <button
                type="submit"
                className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                disabled={loading}
                >
                {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}
