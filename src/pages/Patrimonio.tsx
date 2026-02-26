import React, { useState } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import clsx from 'clsx';

const initialAssets = [
  { id: 1, name: 'Mesa de Som Yamaha', category: 'Áudio', location: 'Templo Principal', condition: 'Bom', purchaseDate: '10/05/2021', value: 4500.00 },
  { id: 2, name: 'Projetor Epson', category: 'Vídeo', location: 'Salão Anexo', condition: 'Regular', purchaseDate: '15/08/2019', value: 2800.00 },
  { id: 3, name: 'Bateria Pearl', category: 'Instrumentos', location: 'Templo Principal', condition: 'Bom', purchaseDate: '20/11/2020', value: 6500.00 },
  { id: 4, name: 'Ar Condicionado 30.000 BTUs', category: 'Equipamentos', location: 'Sala 02', condition: 'Manutenção', purchaseDate: '05/02/2018', value: 3200.00 },
];

export function Patrimonio() {
  const [assets, setAssets] = useState(initialAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Áudio',
    location: '',
    condition: 'Bom',
    purchaseDate: '',
    value: '',
    photo: null as File | null
  });

  const [editingAsset, setEditingAsset] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return;

    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === editingAsset.id ? {
        ...a,
        name: formData.name,
        category: formData.category,
        location: formData.location || 'Não especificado',
        condition: formData.condition,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toLocaleDateString('pt-BR') : 'N/A',
        value: parseFloat(formData.value)
      } : a));
      setEditingAsset(null);
    } else {
      const newAsset = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        location: formData.location || 'Não especificado',
        condition: formData.condition,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toLocaleDateString('pt-BR') : 'N/A',
        value: parseFloat(formData.value)
      };
      setAssets(prev => [...prev, newAsset]);
    }

    setIsModalOpen(false);
    setFormData({ name: '', category: 'Áudio', location: '', condition: 'Bom', purchaseDate: '', value: '', photo: null });
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    // Convert DD/MM/YYYY to YYYY-MM-DD for input type="date"
    let formattedDate = '';
    if (asset.purchaseDate && asset.purchaseDate !== 'N/A') {
      const parts = asset.purchaseDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    setFormData({
      name: asset.name,
      category: asset.category,
      location: asset.location,
      condition: asset.condition,
      purchaseDate: formattedDate,
      value: asset.value.toString(),
      photo: null
    });
    setIsModalOpen(true);
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? a.category === filterCategory : true;
    const matchesCondition = filterCondition ? a.condition === filterCondition : true;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const totalValue = assets.reduce((acc, curr) => acc + curr.value, 0);
  const maintenanceCount = assets.filter(a => a.condition === 'Manutenção').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Patrimônio</h1>
          <p className="text-sm text-secondary-500">Controle de bens, equipamentos e instrumentos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm"
          >
            Exportar
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingAsset(null);
              setFormData({ name: '', category: 'Áudio', location: '', condition: 'Bom', purchaseDate: '', value: '', photo: null });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Box className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Total de Itens</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{assets.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Valor Estimado</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Em Manutenção</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{maintenanceCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center shadow-sm",
              showFilters ? "bg-secondary-100 border-secondary-300 text-secondary-900" : "bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50"
            )}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Categoria</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas</option>
              <option>Áudio</option>
              <option>Vídeo</option>
              <option>Instrumentos</option>
              <option>Móveis</option>
              <option>Equipamentos</option>
              <option>Outros</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Condição</label>
            <select 
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas</option>
              <option>Bom</option>
              <option>Regular</option>
              <option>Manutenção</option>
              <option>Ruim</option>
            </select>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondary-600">
            <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Localização</th>
                <th className="px-6 py-4">Condição</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-secondary-900">{asset.name}</td>
                  <td className="px-6 py-4">{asset.category}</td>
                  <td className="px-6 py-4">{asset.location}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                      asset.condition === 'Bom' ? "bg-green-100 text-green-700" : 
                      asset.condition === 'Regular' ? "bg-yellow-100 text-yellow-700" : 
                      "bg-orange-100 text-orange-700"
                    )}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    R$ {asset.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button onClick={() => handleEdit(asset)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                        <button onClick={() => {
                          if(confirm('Tem certeza que deseja excluir este item?')) {
                            setAssets(prev => prev.filter(a => a.id !== asset.id));
                          }
                        }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingAsset ? 'Editar Item' : 'Novo Item de Patrimônio'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAsset(null);
                  setFormData({ name: '', category: 'Áudio', location: '', condition: 'Bom', purchaseDate: '', value: '', photo: null });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-asset-form" onSubmit={handleAddAsset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Nome do Item *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Projetor Epson" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Categoria</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Áudio</option>
                      <option>Vídeo</option>
                      <option>Instrumentos</option>
                      <option>Móveis</option>
                      <option>Equipamentos</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Condição</label>
                    <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Bom</option>
                      <option>Regular</option>
                      <option>Manutenção</option>
                      <option>Ruim</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Localização</label>
                  <input name="location" value={formData.location} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Templo Principal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Data de Aquisição</label>
                    <input name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Valor Estimado (R$) *</label>
                    <input required name="value" value={formData.value} onChange={handleInputChange} type="number" step="0.01" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Foto do Item</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAsset(null);
                  setFormData({ name: '', category: 'Áudio', location: '', condition: 'Bom', purchaseDate: '', value: '', photo: null });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-asset-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingAsset ? 'Salvar Alterações' : 'Salvar Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exportar */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Exportar Patrimônio</h2>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Formato</label>
                <select className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>PDF</option>
                  <option>Excel (CSV)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Incluir Itens</label>
                <select className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Todos os itens</option>
                  <option>Apenas itens em manutenção</option>
                  <option>Apenas itens em bom estado</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('Relatório exportado com sucesso!');
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
