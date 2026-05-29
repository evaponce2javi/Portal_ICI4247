import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import {
  ChevronLeft,
  Download,
  Search,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { publicApi } from "../../utils/api";

/**
 * Contrataciones y Compras.
 * Los datos se obtienen en vivo del backend (GET /api/contratos).
 * Si la API no responde, se usa un conjunto de demostración.
 */

type ContractRow = {
  id: number;
  tipo: string; // departamento asociado
  descripcion: string; // título del contrato
  proveedor: string;
  monto: number;
  fecha: string;
  estado: string;
};

const fallbackContracts: ContractRow[] = [
  {
    id: 1,
    tipo: "Obras Públicas",
    descripcion: "Construcción de Plaza Comunitaria Sector Norte",
    proveedor: "Constructora Horizon SpA",
    monto: 145000000,
    fecha: "15/02/2026",
    estado: "Vigente",
  },
  {
    id: 2,
    tipo: "Administración y Finanzas",
    descripcion: "Suministro de combustible para vehículos municipales",
    proveedor: "Copec S.A.",
    monto: 28500000,
    fecha: "01/03/2026",
    estado: "Vigente",
  },
  {
    id: 3,
    tipo: "Aseo y Ornato",
    descripcion: "Mantención y reparación de luminarias públicas",
    proveedor: "Electro Servicios Ltda.",
    monto: 62000000,
    fecha: "10/01/2026",
    estado: "Vigente",
  },
  {
    id: 4,
    tipo: "Administración y Finanzas",
    descripcion: "Adquisición de equipamiento computacional",
    proveedor: "TechSolutions Chile S.A.",
    monto: 35000000,
    fecha: "20/03/2026",
    estado: "Finalizado",
  },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CL");
};

export default function Contracts() {
  const location = useLocation();
  const { month, year } = location.state || { month: "Marzo", year: "2026" };
  const [searchTerm, setSearchTerm] = useState("");

  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi.getContratos();
        if (cancelled) return;
        if (data && data.length > 0) {
          const now = Date.now();
          setContracts(
            data.map((c) => {
              const termina = c.fechaTermino
                ? new Date(c.fechaTermino).getTime()
                : null;
              return {
                id: c.id,
                tipo: c.departamento?.nombre || `Departamento #${c.departamentoId}`,
                descripcion: c.titulo,
                proveedor: c.proveedor,
                monto: Number(c.monto),
                fecha: formatDate(c.fechaInicio),
                estado: termina && termina < now ? "Finalizado" : "Vigente",
              };
            })
          );
          setLive(true);
        } else {
          setContracts(fallbackContracts);
          setLive(false);
        }
      } catch {
        if (!cancelled) {
          setContracts(fallbackContracts);
          setLive(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);

  const totalContracts = contracts.reduce((sum, item) => sum + item.monto, 0);

  // Agrupar montos por departamento para el gráfico
  const chartData = Array.from(
    contracts.reduce((map, c) => {
      map.set(c.tipo, (map.get(c.tipo) || 0) + c.monto);
      return map;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  const handleDownload = () => {
    const csv = [
      ["Departamento", "Título", "Proveedor", "Monto", "Fecha", "Estado"],
      ...contracts.map((c) => [
        c.tipo,
        c.descripcion,
        c.proveedor,
        c.monto,
        c.fecha,
        c.estado,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrataciones-${month}-${year}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              to="/categorias"
              state={{ month, year }}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Categorías
            </Link>
            <span>/</span>
            <span className="text-gray-900">Contrataciones y Compras</span>
          </div>
          <p className="text-sm text-gray-600">
            Período:{" "}
            <span className="font-semibold text-gray-900">
              {month} {year}
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contrataciones y Compras
            </h1>
            <p className="text-gray-600">
              Contratos vigentes y proveedores del municipio
            </p>
          </div>
          {!loading && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                live
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {live ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              {live ? "Datos en vivo (API)" : "Datos de demostración"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando contratos desde la API...
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Total Contratado</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalContracts)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Contratos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {contracts.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Proveedores Únicos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(contracts.map((c) => c.proveedor)).size}
                </p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Distribución por Departamento
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#1e40af"
                      name="Monto Contratado"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Search and Download */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por título o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-[#1e3a8a] transition-colors flex items-center gap-2 justify-center"
                >
                  <Download className="w-4 h-4" />
                  Descargar CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Fecha Inicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredContracts.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-gray-500 text-sm"
                        >
                          No se encontraron contratos.
                        </td>
                      </tr>
                    )}
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {contract.tipo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {contract.descripcion}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {contract.proveedor}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                          {formatCurrency(contract.monto)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {contract.fecha}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              contract.estado === "Vigente"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {contract.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
