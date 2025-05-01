"use client";
import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { ExerciseIntro } from "../../components/Intro";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import toast from "react-hot-toast";
import MarkdownIt from "markdown-it";
import { BiSolidSend } from "react-icons/bi";
import { useRouter } from "next/navigation"; // Import useRout

import { useUser } from "../../context/UserContext";
import { account } from "@/app/api/appwriter";
const API_KEY: any = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
export default function Home() {
  const { user, setUser, logout, loading, showLoader, hideLoader } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);

  const [imageBase64, setImageBase64] = useState("");
  const [textInput, setTextInput] = useState("");
  const [output, setOutput] = useState("");
  const router = useRouter(); // Initialize useRouter
  const outputEndRef = useRef<any>(null);

  const imageAnalysisPrompt = `
Analyze the uploaded image and the additional input: "${textInput}" to assess the person's fitness level, body composition, and health characteristics. Generate a detailed, structured, and visually appealing response in Markdown format with tables, borders, and emojis.

---

### **Your Personalized Fitness Plan** 🌟

#### **1. Fitness Level Assessment** 🏋️‍♂️  
- Describe the person's current fitness level (beginner, intermediate, advanced) based on visual cues (muscle tone, posture, body fat, etc.).  
- Highlight strengths and areas for improvement.  

---

#### **2. 7-Day Diet Plan** 🍎  
Present a balanced meal plan in a table with borders. Include portion sizes and hydration tips.  

**Daily Meal Structure:**  

| Day       | Breakfast 🥞               | Lunch 🥗                  | Dinner 🍲               | Snacks & Drinks 🍏       |  
|-----------|---------------------------|--------------------------|-------------------------|--------------------------|  
| **Day 1** | Oatmeal + Berries + Nuts  | Grilled Chicken + Quinoa | Baked Salmon + Veggies  | Greek Yogurt + Almonds   |  
| **Day 2** | Smoothie + Spinach + Protein | Turkey Wrap + Salad  | Stir-Fry Tofu + Rice    | Hummus + Carrot Sticks   |  
| ...       | ...                       | ...                      | ...                     | ...                      |  

**Hydration Tip:** 💧 Drink 3-4L water daily. Herbal teas and infused water encouraged!  

---

#### **3. Workout Routine** 💪🔥  
A weekly plan with exercises, duration, and intensity in a bordered table.  

| Day       | Strength 🏋️‍♀️          | Cardio 🏃‍♂️            | Flexibility 🧘‍♀️       | Notes 📝                |  
|-----------|-----------------------|-----------------------|------------------------|-------------------------|  
| **Day 1** | Squats, Push-ups (3x12) | 30-min Run           | 15-min Yoga            | Focus on form!          |  
| **Day 2** | Deadlifts, Rows (3x10) | Cycling (45 min)      | Dynamic Stretching     | Stay hydrated.          |  
| ...       | ...                   | ...                   | ...                    | ...                     |  

---

#### **4. Nutritional Advice** 🥑🍗  
- **Macronutrients:**  
  - Protein: 30% (Lean meats, legumes)  
  - Carbs: 40% (Whole grains, veggies)  
  - Fats: 30% (Avocados, nuts, olive oil)  
- **Key Micronutrients:** Iron (spinach), Vitamin D (sunlight), Omega-3 (fish).  

---

#### **5. Motivational Tips** ✨🚀  
- **"Progress > Perfection!"** – Track small wins weekly.  
- **Find a Buddy** 👫 – Accountability boosts consistency.  
- **Reward System** 🎁 – Treat yourself for milestones (e.g., new workout gear).  

---

#### **6. Health Recommendations** 🌿💤  
- **Sleep:** 7-9 hours/night ⏰.  
- **Stress Management:** Meditation/Deep breathing (10 min/day).  
- **Avoid:** Processed sugars and late-night caffeine.  

**Formatting Requirements:**  
- Use Markdown syntax throughout  
- Maintain consistent table borders (\`|---|\`)  
- Include at least 2 relevant emojis per section  
- Bold important terms (e.g., **Macronutrients**)  
- Use section dividers (\`---\`) between categories  
  `;

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select an image file.");
      return;
    }

    try {
      const base64: any = await new Promise((resolve: any, reject: any) => {
        const reader: any = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result.split(",")[1]);
          setSelectedImage(reader.result);
        };
        reader.onerror = reject;
      });
      setImageBase64(base64);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handleGenerate = async () => {
    if (!imageBase64) {
      toast.error("Please upload an image.");
      return;
    }
    if (!textInput) {
      toast.error("Please enter a prompt.");
      return;
    }
    console.log("called generater");

    setOutput(""); // Clear previous output
    try {
      showLoader();
      const contents: any = [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
            { text: imageAnalysisPrompt },
          ],
        },
      ];

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const result = await model.generateContentStream({ contents });
      console.log(result);
      const md = new MarkdownIt();
      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
        setOutput(md.render(buffer.join("")));
      }
    } catch (error: any) {
      console.error("Error:", error);
      setOutput(`Error: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error: any) {
      router.push("/");
      console.log("User not authenticated:", error.message);
      setUser(null);
    } finally {
    }
  };

  useEffect(() => {
    setTimeout(() => {
      hideLoader();
    }, 1000);
    fetchUser();
  }, []);
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output]);
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <div
        className={"w-full flex-grow"}
        style={{
          backgroundImage: "url('/images/new-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header />
        <div className={"mt-24 px-4 my-6"}>
          <div className={"max-w-5xl p-4 mx-auto bg-black/80"}>
            <ExerciseIntro name={user?.name} />
            <div className={"w-full"}>
              <div className="flex-1 flex-row items-end justify-end">
                <div className="mt-6 flex items-center justify-between gap-x-6">
                  <div
                    className={
                      "flex justify-center items-center gap-2 text-white text-xl  font-bold"
                    }
                  >
                    Generate Diet Plan
                  </div>
                </div>
                <div></div>
              </div>
              <hr className={"my-5"} />
              <div className="p-4">
                {/* Image Upload */}
                <div className="mb-4 ">
                  <label className="cursor-pointer p-2 bg-gradient-to-r text-white   font-bold text-lg  hover:bg-white/80 hover:text-black/80 rounded-md  bg-black/50 border border-input">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedImage && (
                  <div className="mt-4 md:mt-0">
                    <p className="text-white text-sm mb-2">Preview:</p>

                    <img
                      src={selectedImage}
                      alt="Uploaded Preview"
                      className="w-64 h-64 object-cover rounded-lg shadow-md border"
                    />
                  </div>
                )}
                {/* Text Input */}
                <div className="mb-4">
                  <label
                    className="block font-semibold mb-2 text-white"
                    htmlFor="textInput"
                  >
                    Ask me :
                  </label>
                  <textarea
                    id="textInput"
                    rows={4}
                    value={textInput}
                    placeholder="Ask me anything..."
                    onChange={(e: any) => setTextInput(e.target.value)}
                    className="w-full border  px-2 py-1  rounded-md p-1 ring-1 ring-inset ring-primary-light placeholder:text-gray-200"
                  ></textarea>
                </div>

                {/* Generate Button */}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="submit"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="rounded-md cursor-pointer border  bg-black/60 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:bg-black/15  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {loading ? (
                      "Generating..."
                    ) : (
                      <div
                        className={"flex justify-center  items-center gap-2"}
                      >
                        Image Recogniser <BiSolidSend />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${output ? "mt-16 px-14 my-6" : ""}`}>
        {output && (
          <div className="mt-4 output" id="output">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Your Personalized Fitness Plan:
            </h2>

            <div
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-4"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div dangerouslySetInnerHTML={{ __html: output }}></div>
              <div ref={outputEndRef} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
