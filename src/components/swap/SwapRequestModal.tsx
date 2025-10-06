import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";

export default function SwapRequestModal({ open, onClose, plant }: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-3">
        Proponer intercambio con {plant?.nombre}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tu planta</label>
          <select className="w-full mt-1 p-2 border rounded-lg">
            <option>Poto</option>
            <option>Monstera</option>
            <option>Jade</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Punto de intercambio</label>
          <select className="w-full mt-1 p-2 border rounded-lg">
            <option>Parque Central</option>
            <option>Mercado Verde</option>
            <option>Mi casa (2 km)</option>
          </select>
        </div>
        <Button
          onClick={() => {
            onClose();
            alert("Solicitud enviada ✉️");
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Enviar solicitud
        </Button>
      </div>
    </Dialog>
  );
}
