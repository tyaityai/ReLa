import logoImage from '../assets/ReLa.svg';
import "../index.css";

function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <img src={logoImage} alt="Logo" className="w-36" 
                style={{
                    animation: 'fadeInOut 2s ease-in-out forwards'
                }}
            />
        </div>
    );
}
export default Loading;