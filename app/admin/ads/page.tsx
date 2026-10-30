'use client';
import { useState } from 'react';
import { PageHead, StateBox, fmt } from '@/components/layout/AdminShell';
import { useAdminData } from '@/services/useAdminData';
import { callAdmin, friendlyError } from '@/services/adminApi';
import { fileToBase64 } from '@/services/download';

const EMPTY = { advertiser: '', title: '', body: '', ctaLabel: 'Learn more', ctaUrl: '', targetGender: '', targetCities: '', weight: 1, startsAt: '', endsAt: '', imagePath: '', imageUrl: '' };
const toLocal = (s?: string | null) => (s ? new Date(s).toISOString().slice(0, 16) : '');

export default function AdsPage() {
  const { data, error, loading, reload } = useAdminData<any>('list_ads');
  const [form, setForm] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const edit = (a?: any) => {
    setMsg(null);
    setForm(a ? {
      id: a.id, advertiser: a.advertiser, title: a.title, body: a.body, ctaLabel: a.cta_label, ctaUrl: a.cta_url ?? '',
      targetGender: a.target_gender, targetCities: (a.target_cities ?? []).join(', '), weight: a.weight,
      startsAt: toLocal(a.starts_at), endsAt: toLocal(a.ends_at), imagePath: a.image_path ?? '', imageUrl: a.imageUrl ?? '',
    } : { ...EMPTY });
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (file.size > 1024 * 1024) { setMsg('Image must be 1 MB or smaller (JPEG, PNG or WEBP).'); return; }
    setBusy(true); setMsg(null);
    try {
      const r = await callAdmin<any>('upload_ad_image', { base64: await fileToBase64(file) });
      setForm((f: any) => ({ ...f, imagePath: r.path, imageUrl: r.url }));
    } catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };
  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      await callAdmin('save_ad', { ad: {
        ...form, targetCities: String(form.targetCities).split(',').map((c: string) => c.trim()).filter(Boolean),
        startsAt: form.startsAt || undefined, endsAt: form.endsAt || undefined, imagePath: form.imagePath || undefined,
      } });
      setForm(null); reload();
    } catch (e) { setMsg(friendlyError(e)); } finally { setBusy(false); }
  };
  const toggle = async (a: any) => { try { await callAdmin('set_ad_active', { adId: a.id, active: !a.active }); reload(); } catch (e) { alert(friendlyError(e)); } };
  const remove = async (a: any) => { if (!confirm(`Delete the ad "${a.title}"? Its stats are deleted too.`)) return; try { await callAdmin('delete_ad', { adId: a.id }); reload(); } catch (e) { alert(friendlyError(e)); } };
  const live = (a: any) => a.active && new Date(a.starts_at) <= new Date() && (!a.ends_at || new Date(a.ends_at) > new Date());

  return (
    <div className="space-y-5">
      <PageHead title="Ads (Sponsored cards)" subtitle="Sponsored cards appear in Discover after every 7 profiles, always labelled “Sponsored”. Swiping never likes anything. New ads start paused: check the preview, then press Start. Counts are unique members per day."
        action={<button onClick={() => edit()} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold">New ad</button>} />
      <StateBox loading={loading} error={error} empty={!!data && data.ads.length === 0} emptyText="No ads yet." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.ads.map((a: any) => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
            {a.imageUrl ? <img src={a.imageUrl} alt="" className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-slate-100" />}
            <div className="p-4 space-y-1">
              <div className="flex justify-between"><span className="font-bold text-slate-500">{a.advertiser}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${live(a) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{live(a) ? 'Live' : a.active ? 'Scheduled / ended' : 'Paused'}</span></div>
              <div className="font-extrabold text-sm">{a.title}</div>
              <div className="text-slate-600">{a.body}</div>
              <div className="text-slate-500">Audience: {a.target_gender ? (a.target_gender === 'man' ? 'men' : 'women') : 'everyone'}{a.target_cities?.length ? ` in ${a.target_cities.join(', ')}` : ''}</div>
              <div className="text-slate-500">{fmt(a.starts_at)} → {a.ends_at ? fmt(a.ends_at) : 'no end'}</div>
              <div className="font-semibold">{a.impressions} views · {a.clicks} clicks · CTR {a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(1) : '0.0'}%</div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => toggle(a)} className="font-bold text-rose-700 hover:underline">{a.active ? 'Pause' : 'Start'}</button>
                <button onClick={() => edit(a)} className="font-bold hover:underline">Edit</button>
                <button onClick={() => remove(a)} className="font-bold text-slate-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {form && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-3 text-sm">
            <h2 className="font-extrabold">{form.id ? 'Edit ad' : 'New ad'}</h2>
            {[['advertiser', 'Advertiser (company name)', 60], ['title', 'Headline', 60], ['ctaLabel', 'Button text', 24], ['ctaUrl', 'Link (https://…)', 500]].map(([k, l, m]) => (
              <label key={k as string} className="block"><span className="text-xs font-bold text-slate-600">{l}</span>
                <input value={form[k as string]} maxLength={m as number} onChange={(e) => setForm({ ...form, [k as string]: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
            ))}
            <label className="block"><span className="text-xs font-bold text-slate-600">Text</span>
              <textarea value={form.body} maxLength={300} rows={3} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold text-slate-600">Show to</span>
                <select value={form.targetGender} onChange={(e) => setForm({ ...form, targetGender: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300">
                  <option value="">Everyone</option><option value="man">Men</option><option value="woman">Women</option></select></label>
              <label className="block"><span className="text-xs font-bold text-slate-600">Weight (1–100)</span>
                <input type="number" min={1} max={100} value={form.weight} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
            </div>
            <label className="block"><span className="text-xs font-bold text-slate-600">Cities (comma separated, empty = all)</span>
              <input value={form.targetCities} onChange={(e) => setForm({ ...form, targetCities: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold text-slate-600">Start</span>
                <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
              <label className="block"><span className="text-xs font-bold text-slate-600">End (optional)</span>
                <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
            </div>
            <label className="block"><span className="text-xs font-bold text-slate-600">Image (JPEG/PNG/WEBP, max 1 MB, portrait 3:4 works best)</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(e.target.files?.[0])} className="block text-xs mt-1" /></label>
            {form.imageUrl && <img src={form.imageUrl} alt="Ad image preview" className="w-32 h-40 object-cover rounded-xl border" />}
            <p className="text-[11px] text-slate-500">Ads must follow Google Play&apos;s Ads policy and Indian advertising rules (ASCI): no dating, adult, gambling, betting, alcohol or misleading ads.</p>
            {msg && <p role="alert" className="text-xs text-rose-700">{msg}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setForm(null)} className="px-4 py-2 rounded-xl border font-bold">Cancel</button>
              <button disabled={busy || !form.advertiser.trim() || !form.title.trim()} onClick={save} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
