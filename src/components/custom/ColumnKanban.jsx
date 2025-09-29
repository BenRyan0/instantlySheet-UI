import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";

export const ColumnKanban = () => {
  return (
    <div className="h-fit w-fit text-neutral-50">
      <Board />
    </div>
  );
};

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-8 overflow-hidden p-12">
      {/* JSON attributes column (delete only) */}
      <Column
        title="JSON Attributes (sheet1)"
        column="json"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
        allowDelete
        allowAdd={false}
      />

      {/* Google Sheet columns (add + delete) */}
      <Column
        title="Google Sheet Columns"
        column="sheet"
        headingColor="text-green-200"
        cards={cards}
        setCards={setCards}
        allowDelete
        allowAdd
      />
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  allowDelete,
  allowAdd,
}) => {
  const [active, setActive] = useState(false);
  const [newCol, setNewCol] = useState("");
  const filteredCards = cards.filter((c) => c.column === column);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  // Dropping into empty column area
  const handleDrop = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    let copy = [...cards];
    let cardToTransfer = copy.find((c) => c.id === cardId);
    if (!cardToTransfer) return;

    // Move to this column
    cardToTransfer = { ...cardToTransfer, column };
    copy = copy.filter((c) => c.id !== cardId);
    copy.push(cardToTransfer);
    setCards(copy);

    setActive(false);
  };

  // Reorder with arrows
  const moveCard = (id, direction) => {
    setCards((prev) => {
      const copy = [...prev];
      const index = copy.findIndex((c) => c.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // stay in same column only
      if (
        targetIndex < 0 ||
        targetIndex >= copy.length ||
        copy[targetIndex].column !== column
      )
        return prev;

      // swap
      [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
      return [...copy];
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };
  const handleDragLeave = () => setActive(false);

  const handleDelete = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCol.trim()) return;
    const newCard = {
      id: Math.random().toString(),
      title: newCol.trim(),
      column,
    };
    setCards((prev) => [...prev, newCard]);
    setNewCol("");
  };

  return (
    <div className="w-[400px] shrink-0 ">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex text-center justify-center items-center gap-1">
          <div className="relative">
            <h3 className={`font-medium ${headingColor}`}>{title}</h3>{" "}
            <span className="absolute -top-4 -right-8 w-7 h-7 text-center flex justify-center items-center text-sm text-white bg-gray-600 rounded-full font-bold">
              {filteredCards.length}
            </span>
          </div>
        </div>
        {title === "Google Sheet Columns" && (
          <div className="flex flex-row gap-2">
            <button
              onClick={() => setCards([])}
              className="bg-[#262626] px-3 py-1 rounded-sm flex justify-center items-center gap-1"
            >
              Reset
            </button>
            <button
              onClick={() => setCards(DEFAULT_CARDS)}
              className="bg-[#262626] px-3 py-1 rounded-sm flex justify-center items-center gap-1"
            >
              {" "}
              Default
            </button>
          </div>
        )}
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-[70px] rounded border p-3 transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c, idx) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            onDelete={handleDelete}
            allowDelete={allowDelete}
            moveCard={moveCard}
            isFirst={idx === 0}
            isLast={idx === filteredCards.length - 1}
          />
        ))}

        {allowAdd && (
          <form onSubmit={handleAdd} className="mt-3 flex gap-2">
            <input
              value={newCol}
              onChange={(e) => setNewCol(e.target.value)}
              placeholder="New column..."
              className="flex-1 rounded bg-neutral-800 p-2 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded bg-neutral-100 p-3 gap-1 text-neutral-900 hover:bg-neutral-300 flex justify-center items-center font-bold text-sm"
            >
              ADD
              <FiPlus size={17} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Card = ({
  title,
  id,
  column,
  handleDragStart,
  allowDelete,
  onDelete,
  moveCard,
  isFirst,
  isLast,
}) => {
  return (
    <motion.div
      layout
      layoutId={id}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, { title, id, column })}
      className="mb-2 flex items-center justify-between gap-2 rounded border border-neutral-700 bg-neutral-800 p-3 text-sm text-neutral-100 cursor-grab active:cursor-grabbing"
    >
      <span className="flex-1 text-wrap text-start">{title}</span>

      <div className="flex gap-1">
        {/* Up Arrow */}
        <button
          disabled={isFirst}
          onClick={() => moveCard(id, "up")}
          className={`p-1 ${
            isFirst
              ? "text-neutral-600"
              : "text-neutral-400 hover:text-blue-400"
          }`}
        >
          <FiArrowUp />
        </button>
        {/* Down Arrow */}
        <button
          disabled={isLast}
          onClick={() => moveCard(id, "down")}
          className={`p-1 ${
            isLast ? "text-neutral-600" : "text-neutral-400 hover:text-blue-400"
          }`}
        >
          <FiArrowDown />
        </button>

        {column === "json" && (
          <div className="absolute left-2 right-0 w-6/12 text-end flex justify-end pointer-events-none transition-all duration-300 md:block hidden">
            <div className="pointer-events-auto">
              <FaChevronRight />
            </div>
          </div>
        )}

        {/* Delete */}
        {allowDelete && (
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-neutral-400 hover:text-red-500"
          >
            <FiTrash />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Example JSON + Sheet Columns
const DEFAULT_CARDS = [
  // JSON attributes
  { id: "1", title: "userId", column: "json" },
  { id: "2", title: "firstName", column: "json" },
  { id: "3", title: "lastName", column: "json" },
  { id: "4", title: "email", column: "json" },
  { id: "5", title: "createdAt", column: "json" },

  // Google Sheet columns
  { id: "6", title: "Column 1", column: "sheet" },
  { id: "7", title: "For scheduling", column: "sheet" },
  { id: "8", title: "sales person", column: "sheet" },
  { id: "9", title: "company", column: "sheet" },
  { id: "10", title: "company phone#", column: "sheet" },
  { id: "11", title: "phone#from email", column: "sheet" },
  { id: "12", title: "lead first name", column: "sheet" },
  { id: "13", title: "lead last name", column: "sheet" },
  { id: "14", title: "lead email", column: "sheet" },
  { id: "15", title: "Column 1", column: "sheet" },
  { id: "16", title: "email reply", column: "sheet" },
  { id: "17", title: "phone 1", column: "sheet" },
  { id: "18", title: "phone 2", column: "sheet" },
  { id: "19", title: "address", column: "sheet" },
  { id: "20", title: "city", column: "sheet" },
  { id: "21", title: "state", column: "sheet" },
  { id: "22", title: "zip", column: "sheet" },
  { id: "23", title: "details", column: "sheet" },
  { id: "24", title: "Email Signature", column: "sheet" },
  { id: "25", title: "linkedin link", column: "sheet" },
  { id: "26", title: "2nd contact person linked", column: "sheet" },
  { id: "27", title: "status after the call", column: "sheet" },
  { id: "28", title: "number of calls spoken with the leads", column: "sheet" },
  { id: "29", title: "@dropdown", column: "sheet" },
  { id: "30", title: "number of calls spoken with the leads", column: "sheet" },
];
