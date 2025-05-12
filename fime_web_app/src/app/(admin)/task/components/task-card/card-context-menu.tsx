"use client";

import CardDeleteAlert from "@/app/(admin)/task/components/task-card/card-delete-alert";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useBoundStore } from "@/providers/store-provider";
import { Trash } from "lucide-react";
import { useState } from "react";

const CardContextMenu = () => {
  const { selectedCard, contextMenuPosition, clearContextMenu } = useBoundStore(
    (state) => state
  );
  const [transferCard, setTransferCard] = useState<string | null>(null);
  const [deleteCard, setDeleteCard] = useState<string | null>(null);

  console.log("selectedCard", transferCard);

  return (
    <>
      <Popover open={!!selectedCard} onOpenChange={clearContextMenu}>
        <PopoverContent
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            // zIndex: 1000,
            padding: 0,
            width: "200px",
          }}
        >
          <Command>
            <CommandList>
              <CommandGroup heading="Tùy chọn">
                <CommandSeparator />
                <CommandItem>
                  <div
                    className="w-full h-full flex flex-row"
                    onClick={() => setDeleteCard(selectedCard)}
                  >
                    Xóa Thẻ
                    <Trash className="ml-auto h-4 w-4" />
                  </div>
                </CommandItem>
                <CommandItem className="w-full h-full">
                  <div
                    className="h-full w-full"
                    onClick={() => setTransferCard(selectedCard)}
                  >
                    Search Emoji
                  </div>
                </CommandItem>
                <CommandItem>
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={!!deleteCard} onOpenChange={() => setDeleteCard(null)}>
        <CardDeleteAlert
          id={deleteCard || ""}
          openChange={() => setDeleteCard(null)}
        />
      </Dialog>

      <Dialog open={!!transferCard} onOpenChange={() => setTransferCard(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Chọn</DialogTitle>test
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardContextMenu;
