import React from "react";

const Sidebar = ({ authenticated, selected, setSelected, embeddedWallet, linkedWallet }) => {
  const menuItems = [
    { name: "Forum", key: "Forum" },
    { name: "Thread List", key: "Thread List" },
    { name: "Thread Page", key: "Thread Page" },
  ];

  if (!authenticated) {
    return null;
  }

  return (
    <div className="w-64 bg-secondary-bg border-r border-border-color h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Navigation</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setSelected(item.key)}
                className={`w-full text-left p-3 rounded-md transition-colors ${selected === item.key ? "bg-accent-purple bg-opacity-40 text-text-primary" : "text-text-secondary hover:bg-accent-purple hover:bg-opacity-20"}`}>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
