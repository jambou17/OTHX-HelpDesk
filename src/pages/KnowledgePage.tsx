import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KnowledgeArticle } from '../types';
import { ArticleCard } from '../components/knowledge/ArticleCard';
import { ArticleViewer } from '../components/knowledge/ArticleViewer';
import { ArticleEditor } from '../components/knowledge/ArticleEditor';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { BookOpen, PlusCircle, CheckCircle2, FileText, Archive } from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const { state, saveArticle } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // Mode: list, view, edit, new
  const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'new'>('list');
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticle | null>(null);

  const categories = [
    { id: 'todas', label: 'Todas as Categorias' },
    { id: 'TOTVS Protheus', label: 'Protheus' },
    { id: 'Computadores e notebooks', label: 'Computadores' },
    { id: 'Impressoras e etiquetas', label: 'Impressoras' },
    { id: 'Redes e internet', label: 'Redes' },
    { id: 'VPN e acessos', label: 'VPN e Acessos' },
    { id: 'Sistemas e softwares', label: 'Sistemas' },
  ];

  const filteredArticles = state.articles.filter(art => {
    if (selectedCategory !== 'todas' && art.categoria !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'todos' && art.status !== selectedStatus) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = art.titulo.toLowerCase().includes(q);
      const matchContent = art.conteudo.toLowerCase().includes(q);
      const matchSymptom = art.sintomas.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchSymptom) {
        return false;
      }
    }
    return true;
  });

  const handleArchive = (article: KnowledgeArticle) => {
    const updated: KnowledgeArticle = {
      ...article,
      status: 'arquivado',
      dataAtualizacao: new Date().toISOString(),
    };
    saveArticle(updated);
    setActiveArticle(updated);
  };

  return (
    <div className="space-y-6">
      {/* Viewer Mode */}
      {mode === 'view' && activeArticle && (
        <ArticleViewer
          article={activeArticle}
          onBack={() => setMode('list')}
          onEdit={() => setMode('edit')}
          onArchive={() => handleArchive(activeArticle)}
        />
      )}

      {/* Editor / New Article Mode */}
      {(mode === 'edit' || mode === 'new') && (
        <ArticleEditor
          initialArticle={mode === 'edit' ? activeArticle || undefined : undefined}
          onSave={() => setMode('list')}
          onCancel={() => setMode('list')}
        />
      )}

      {/* List Mode */}
      {mode === 'list' && (
        <>
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Base de Conhecimento Técnico
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Biblioteca central de procedimentos, soluções homologadas e FAQs de TI
              </p>
            </div>

            <button
              onClick={() => {
                setActiveArticle(null);
                setMode('new');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Novo Artigo
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Pesquisar por palavras-chave, erros, soluções ou sintomas..."
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="todos">Todos Status</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="arquivado">Arquivado</option>
                </select>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-blue-50 text-[#1565C0] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onView={art => {
                    setActiveArticle(art);
                    setMode('view');
                  }}
                  onEdit={art => {
                    setActiveArticle(art);
                    setMode('edit');
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Nenhum artigo encontrado"
              description="Nenhum procedimento técnico corresponde aos filtros selecionados."
              action={{
                label: 'Limpar Filtros',
                onClick: () => {
                  setSearch('');
                  setSelectedCategory('todas');
                  setSelectedStatus('todos');
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
