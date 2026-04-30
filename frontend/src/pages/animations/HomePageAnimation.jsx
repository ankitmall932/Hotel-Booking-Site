import { TypeAnimation } from "react-type-animation";

export default function HomePageAnimation () {
    return (
        <div className="  w-fit">
            <TypeAnimation
                sequence={ [
                    "Find Your Perfect Stay",
                    2000,
                    "Book Hotels in Seconds",
                    2000,
                    "Explore the World with Ease",
                    2000,
                    "Your Journey Begins Here",
                    2000,
                ]
                }
                speed={ 50 }
                repeat={ Infinity }
                className="text-6xl font-bold text-white"
            />
        </div>
    );
}