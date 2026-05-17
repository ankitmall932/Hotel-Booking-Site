import { TypeAnimation } from "react-type-animation";

export default function RegisterAnimation () {
    return (
        <div className="  w-fit">
            <TypeAnimation
                sequence={ [
                    "Welcome To Our Page",
                    2000,
                    "Explore Rooms ",
                    2000,
                    "Book Your Stay",
                    2000,
                    "Thanks For Choosing Us",
                    2000,
                ] }
                speed={ 50 }
                repeat={ Infinity }
                className="lg:text-4xl sm:text-xl text-lg font-bold text-black"
            />
        </div>
    );
}