import Draggable from "./Draggable";

const ChoiceMap = ({ position, overDrop }) => {
  return (
    <section className="w-2/6 p-2">
      <div className="">
        <h2>Map type</h2>
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            World Map
          </button>
          <button className="px-4 py-2 bg-gray-300 text-black rounded-lg">
            Country Map
          </button>
          <button className="px-4 py-2 bg-gray-300 text-black rounded-lg">
            Country Map
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2>Choose Map</h2>
        <select className="w-full p-2 border border-gray-300 rounded-lg">
          <option>World</option>
          <option>USA</option>
          <option>Canada</option>
          <option>UK</option>
        </select>
      </div>

      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:cursor-pointer">
        Confirm
      </button>

      <div className="w-full h-52 border-black border mt-4 rounded-2xl relative">
        <Draggable id="drag-map" position={position} overDrop={overDrop}>
          Drag me
        </Draggable>
      </div>
    </section>
  );
};

export default ChoiceMap;
