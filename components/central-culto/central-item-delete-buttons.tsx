"use client";

import {
  deleteAvisoAction,
  deleteDecisaoAction,
  deleteHinoAction,
  deletePedidoOracaoAction,
  deleteVisitanteAction,
} from "@/app/central-culto/actions";
import { CentralDeleteItemButton } from "@/components/central-culto/central-delete-item-button";

export function VisitanteDeleteButton({
  cultoId,
  id,
}: {
  cultoId: string;
  id: string;
}) {
  return (
    <CentralDeleteItemButton
      onDelete={() => deleteVisitanteAction(cultoId, id)}
    />
  );
}

export function HinoDeleteButton({ cultoId, id }: { cultoId: string; id: string }) {
  return (
    <CentralDeleteItemButton onDelete={() => deleteHinoAction(cultoId, id)} />
  );
}

export function AvisoDeleteButton({ cultoId, id }: { cultoId: string; id: string }) {
  return (
    <CentralDeleteItemButton onDelete={() => deleteAvisoAction(cultoId, id)} />
  );
}

export function PedidoDeleteButton({ cultoId, id }: { cultoId: string; id: string }) {
  return (
    <CentralDeleteItemButton
      onDelete={() => deletePedidoOracaoAction(cultoId, id)}
    />
  );
}

export function DecisaoDeleteButton({ cultoId, id }: { cultoId: string; id: string }) {
  return (
    <CentralDeleteItemButton onDelete={() => deleteDecisaoAction(cultoId, id)} />
  );
}
