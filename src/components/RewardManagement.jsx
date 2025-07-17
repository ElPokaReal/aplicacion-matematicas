import React, { useState, useEffect } from 'react';
import RewardService from '../services/RewardService';
import { Gift, Star, Award, Crown, Zap, Trophy, Medal, Gem, Smile, ThumbsUp, Edit, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toastHelper';

const iconOptions = [
  'Gift', 'Star', 'Award', 'Crown', 'Zap', 'Trophy', 'Medal', 'Gem', 'Smile', 'ThumbsUp'
];
const iconMap = { Gift, Star, Award, Crown, Zap, Trophy, Medal, Gem, Smile, ThumbsUp };

export default function RewardManagement() {
  const [rewards, setRewards] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', costo_puntos: 0, icono_nombre: 'Gift' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await RewardService.getAllRewards(localStorage.getItem('token'));
      setRewards(data);
    } catch (err) {
      showErrorToast('Error al cargar recompensas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRewards(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = reward => {
    setEditing(reward.id);
    setForm({ ...reward });
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta recompensa?')) return;
    setLoading(true);
    try {
      await RewardService.deleteReward(id, localStorage.getItem('token'));
      showSuccessToast('Recompensa eliminada correctamente.');
      fetchRewards();
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
        await RewardService.updateReward(editing, form, localStorage.getItem('token'));
        showSuccessToast('¡Recompensa actualizada!');
      } else {
        await RewardService.createReward(form, localStorage.getItem('token'));
        showSuccessToast('¡Recompensa creada!');
      }
      setForm({ nombre: '', descripcion: '', costo_puntos: 0, icono_nombre: 'Gift' });
      setEditing(null);
      fetchRewards();
    } catch {
      showErrorToast('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold flex items-center gap-2"><span>←</span>Volver</button>
      <h1 className="text-3xl font-bold mb-6">Gestión de Recompensas</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Costo (puntos)</label>
            <input name="costo_puntos" type="number" value={form.costo_puntos} onChange={handleChange} className="w-full border rounded p-2" required min={0} />
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
                <button type="button" key={icon} onClick={() => setForm(f => ({ ...f, icono_nombre: icon }))} className={`p-2 rounded border ${form.icono_nombre === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600 transition-all disabled:opacity-60" disabled={loading}>
            {loading ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear')}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ nombre: '', descripcion: '', costo_puntos: 0, icono_nombre: 'Gift' }); }} className="bg-gray-300 px-4 py-2 rounded font-bold">Cancelar</button>
          )}
        </div>
      </form>
      <h2 className="text-2xl font-bold mb-4">Recompensas Existentes</h2>
      {loading && <div className="text-gray-500">Cargando...</div>}
      {!loading && rewards.length === 0 && <div className="text-gray-500">No tienes recompensas creadas aún.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map(reward => {
          const Icon = iconMap[reward.icono_nombre] || Gift;
          return (
            <div key={reward.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              <Icon className="w-10 h-10 text-yellow-500" />
              <div className="flex-1">
                <div className="font-bold text-lg">{reward.nombre}</div>
                <div className="text-gray-600 text-sm">{reward.descripcion}</div>
                <div className="text-gray-500 text-xs">Costo: {reward.costo_puntos} puntos</div>
              </div>
              <button onClick={() => handleEdit(reward)} className="p-2 text-blue-500"><Edit className="w-5 h-5" /></button>
              <button onClick={() => handleDelete(reward.id)} className="p-2 text-red-500"><Trash2 className="w-5 h-5" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
} 