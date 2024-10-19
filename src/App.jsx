import React, { useState } from "react";

function App() {
  const [items, setitems] = useState([]);
  const handleaddItems = (item) => {
    setitems((items) => [...items, item]);
  };
  const handledeleteitem = (id) => {
    setitems((items) => items.filter((item) => item.id !== id));
  };

  const handletoggleitem = (id) => {
    setitems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };
  const handleclearlist = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items"
    );
    if (confirmed) setitems([]);
  };

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleaddItems} />
      <PackingList
        items={items}
        ontoggleItem={handletoggleitem}
        onDelete={handledeleteitem}
        onClearlist={handleclearlist}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Far away</h1>;
}

function Form({ onAddItems }) {
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    const newItem = { desc, quantity, packed: false, id: new Date() };
    onAddItems(newItem);
    setDesc("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip</h3>
      <div>
        <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <input
          placeholder="description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
        />
        <button>Add</button>
      </div>
    </form>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>start adding some items to your packing list</em>
      </p>
    );
  }
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItems / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "you got everything!Ready to go."
          : `You have ${numItems} ${
              items.length === 1 ? "items" : `items`
            } on your list and you aready packed ${packedItems} (${percentage}%)`}
      </em>
    </footer>
  );
}

function PackingList({ items, ontoggleItem, onDelete, onClearlist }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems
  if (sortBy === "input" ||sortBy === "") sortedItems  = items
  if (sortBy === "description") sortedItems = items.slice().sort((a,b)=>a.desc.localeCompare(b.desc))
  if (sortBy === "quantity-asc") sortedItems = items.slice().sort((a,b)=> a.quantity-b.quantity)
  if (sortBy==="packed")  sortedItems = items.slice().sort((a,b)=> a.packed-b.packed)
  if (sortBy === "quantity-desc") sortedItems = items.slice().sort((a,b)=> b.quantity-a.quantity)

  return (
    <>
      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              value={item.packed}
              onChange={() => ontoggleItem(item.id)}
            />
            <span style={item.packed ? { textDecoration: "line-through" } : {}}>
              {item.quantity} {item.desc}
            </span>
            <button onClick={() => onDelete(item.id)}>❌</button>
          </li>
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value=''>Sort by...</option>
          <option value="input">input</option>
          <option value="description">description</option>
          <option value="quantity-asc">quantity-asc</option>
          <option value ="packed">packed</option>
          <option value= "quantity-desc">quantity-desc</option>
        </select>
        <button onClick={onClearlist} disabled={items.length === 0}>
          Clear list
        </button>
      </div>
    </>
  );
}

export default App;
