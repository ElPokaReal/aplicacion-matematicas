import React, { useState, useEffect } from 'react';
import StudentService from '../services/StudentService';
import { Award, Star, Crown, Zap, Trophy, Medal, Gift, Gem, Smile, ThumbsUp, Edit, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';

const iconOptions = [
  'Award', 'Star', 'Crown', 'Zap', 'Trophy', 'Medal', 'Gift', 'Gem', 'Smile', 'ThumbsUp'
];
const iconMap = { Award, Star, Crown, Zap, Trophy, Medal, Gift, Gem, Smile, ThumbsUp };

export default function AchievementManagement() {
  const [achievements, setAchievements] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', puntos_otorgados: 0, icono_nombre: 'Award' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await StudentService.getAllAchievements(localStorage.getItem('token'));
      setAchievements(data);
    } catch (err) {
      showErrorToast('Error al cargar logros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = ach => {
    setEditing(ach.id);
    setForm({ ...ach });
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar este logro?')) return;
    setLoading(true);
    try {
      await StudentService.deleteAchievement(id, localStorage.getItem('token'));
      showSuccessToast('Logro eliminado correctamente.');
      fetchAchievements();
    } catch {
      showErrorToast('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await StudentService.updateAchievement(editing, form, localStorage.getItem('token'));
        showSuccessToast('¡Logro actualizado!');
      } else {
        await StudentService.createAchievement(form, localStorage.getItem('token'));
        showSuccessToast('¡Logro creado!');
      }
      setForm({ nombre: '', descripcion: '', puntos_otorgados: 0, icono_nombre: 'Award' });
      setEditing(null);
      fetchAchievements();
    } catch {
      showErrorToast('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold flex items-center gap-2"><span>←</span>Volver</button>
      <h1 className="text-3xl font-bold mb-6">Gestión de Logros</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Puntos Otorgados</label>
            <input name="puntos_otorgados" type="number" value={form.puntos_otorgados} onChange={handleChange} className="w-full border rounded p-2" required min={0} />
          </div>
        </div>
        <div>
          <label className="block font-semibold">Descripción</label>
          <input name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-semibold">Ícono</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {iconOptions.map(icon => {
              const Icon = iconMap[icon];
              return (
                <button type="button" key={icon} onClick={() => setForm(f => ({ ...f, icono_nombre: icon }))} className={`p-2 rounded border ${form.icono_nombre === icon ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-yellow-600 transition-all disabled:opacity-60" disabled={loading}>
            {loading ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear')}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', puntos_otorgados: 0, icono_nombre: 'Award' }); }} className="bg-gray-300 px-4 py-2 rounded font-bold">Cancelar</button>
          )}
        </div>
      </form>
      <h2 className="text-2xl font-bold mb-4">Logros Existentes</h2>
      {loading && <div className="text-gray-500">Cargando...</div>}
      {!loading && achievements.length === 0 && <div className="text-gray-500">No tienes logros creados aún.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(ach => {
          const Icon = iconMap[ach.icono_nombre] || Award;
          return (
            <div key={ach.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <Icon className="w-10 h-10 text-yellow-500" />
              <div className="flex-1">
                <div className="font-bold text-lg">{ach.nombre}</div>
                <div className="text-gray-600 text-sm">{ach.descripcion}</div>
                <div className="text-gray-500 text-xs">Puntos: {ach.puntos_otorgados}</div>
              </div>
              <button onClick={() => handleEdit(ach)} className="p-2 text-blue-500"><Edit className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(ach.id)} className="p-2 text-red-500"><Trash2 className="w-5 h-5" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 