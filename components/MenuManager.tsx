import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { MenuItem } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

const MenuManager: React.FC = () => {
    const { menuItems, updateMenuItems } = useContext(SettingsContext);
    const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        // Sort items by order for initial render
        setLocalMenuItems([...menuItems].sort((a, b) => a.order - b.order));
    }, [menuItems]);

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(localMenuItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        const updatedItems = items.map((item, index) => ({ ...item, order: index }));
        setLocalMenuItems(updatedItems);
        updateMenuItems(updatedItems); // Persist changes
    };

    const toggleVisibility = (id: string) => {
        const updatedItems = localMenuItems.map(item =>
            item.id === id ? { ...item, isVisible: !item.isVisible } : item
        );
        setLocalMenuItems(updatedItems);
        updateMenuItems(updatedItems); // Persist changes
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Navigation Menu</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Drag and drop to reorder menu items. Use the eye icon to toggle visibility.</p>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="menu">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {localMenuItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-base-200-light dark:bg-base-300-dark p-3 rounded-lg flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="text-gray-400" />
                                                <span className={`font-medium ${item.isVisible ? 'text-base-content-light dark:text-base-content-dark' : 'text-gray-500'}`}>{item.name}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleVisibility(item.id)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                {item.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default MenuManager;
