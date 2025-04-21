
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { ProCon } from "./types";

interface ItemListProps {
  type: 'pro' | 'con';
  items: ProCon[];
  newItem: string;
  loading: boolean;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
}

const ItemList = ({
  type,
  items,
  newItem,
  loading,
  onNewItemChange,
  onAddItem,
  onDeleteItem
}: ItemListProps) => {
  const isPro = type === 'pro';
  const title = isPro ? "Pros (Benefits)" : "Cons (Drawbacks)";
  const description = isPro 
    ? "What are the benefits of achieving your goal?"
    : "What might be challenging or difficult?";
  const placeholder = isPro ? "Add a benefit..." : "Add a challenge...";
  const buttonClass = isPro ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";

  return (
    <div className="space-y-4">
      <h3 className={`text-xl font-semibold ${isPro ? 'text-green-700' : 'text-red-700'}`}>
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
      
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => onNewItemChange(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={onAddItem} 
          size="sm"
          disabled={!newItem.trim()}
          className={buttonClass}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border rounded-md">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No {type}s added yet</div>
        ) : (
          <Table>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex justify-between items-center">
                    <span>{item.text}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ItemList;
