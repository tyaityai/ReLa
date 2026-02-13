import addButtonIcon from "../assets/add_button.svg"

interface AddButtonProps {
  onClick: () => void;
}

function AddButton({ onClick }: AddButtonProps) {
  return (
    <>
    <button 
      onClick={onClick}
      className="fixed bottom-[7%] right-[5%] w-14 h-14 rounded-full cursor-pointer"
    >
      <img src={addButtonIcon} alt="Add" className="w-full h-full drop-shadow-lg/15 hover:drop-shadow-lg/30 active:translate-y-0.5 active:drop-shadow-none active:scale-98" 
      />
    </button>
    </>
  );
}

export default AddButton;