import React, { useState, useEffect, useRef } from "react";
import TaskItems from "./TaskItems";
import { FaListUl, FaRegLightbulb, FaQuestionCircle } from "react-icons/fa";
import { MdAddTask } from "react-icons/md";
import { GiDistraction } from "react-icons/gi";

const TaskList = ({ type, icon, isActive, onClick }) => {
    const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(type)) || []);
    const [showInfo, setShowInfo] = useState(false);
    const inputRef = useRef();

    const addItem = () => {
        const inputText = inputRef.current.value.trim();
        if (inputText === "") return;
        const newItem = { id: Date.now(), text: inputText, isComplete: false };
        setItems((prevItems) => [...prevItems, newItem]);
        inputRef.current.value = "";
    };

    const deleteItem = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const toggleItem = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, isComplete: !item.isComplete } : item
            )
        );
    };

    useEffect(() => {
        localStorage.setItem(type, JSON.stringify(items));
    }, [items, type]);

    return (
        <div className="relative">
            {icon && React.cloneElement(icon, { className: "text-white opacity-80 hover:opacity-90 shadow-2xl text-xl hover:scale-110 transition-all ease-linear", onClick })}
            {isActive && (
                <div className="glass-effect absolute top-full -right-3 bg-white shadow-md rounded-lg p-2 w-64 z-50 mt-3 text-md">
                    
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white text-lg">{type === "tasks" ? "Task List" : "Distraction List"}</h3>
                        <div 
                            className="text-white cursor-pointer relative"
                            onMouseEnter={() => setShowInfo(true)} 
                            onMouseLeave={() => setShowInfo(false)} 
                        >
                            <FaQuestionCircle className="text-white cursor-pointer" />
                            {showInfo && (
                                <div className="absolute -right-3 top-6 bg-gray-100 opacity-90 text-black p-2 text-md rounded shadow-xl w-60 z-20 transform scale-95 transition-transform duration-300">
                                    {type === "tasks" 
                                        ? "Use this list to track your important tasks." 
                                        : "Use this list to log distractions and come back to them later."}
                                </div>
                            )}
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`Add ${type}...`}
                        className="w-full p-2 mt-1 border border-neutral-300 text-white rounded text-md"
                    />
                    <button onClick={addItem} className="mt-2 w-full bg-slate-700 text-white py-1 rounded text-md">Add</button>
                    {items.map((item) => (
                        <TaskItems
                            key={item.id}
                            text={item.text}
                            id={item.id}
                            isComplete={item.isComplete} // Always track completion state
                            deleteTask={deleteItem}
                            toggle={toggleItem} // Pass the same toggleItem function
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const TaskManager = () => {
    const [activeList, setActiveList] = useState(null);

    const toggleList = (type) => {
        setActiveList((prev) => (prev === type ? null : type));
    };

    return (
        <div className="flex flex-col items-center mt-7 gap-2 relative">
            <div className="flex gap-4">
                <TaskList 
                    type="tasks" 
                    icon={<MdAddTask size={30}/>} 
                    isActive={activeList === "tasks"} 
                    onClick={() => toggleList("tasks")} 
                />
                <TaskList 
                    type="distractions" 
                    icon={<GiDistraction size={30} />} 
                    isActive={activeList === "distractions"} 
                    onClick={() => toggleList("distractions")} 
                />
            </div>
        </div>
    );
};

export default TaskManager;
