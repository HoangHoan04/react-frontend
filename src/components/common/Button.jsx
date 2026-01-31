export default function ButtonCustom({ label, onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {label}
    </button>
  );
}
