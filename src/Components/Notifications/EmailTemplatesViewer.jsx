import { useState } from "react";
import { Mail, Eye, Copy, Check, Smartphone, Zap, Gift, AlertTriangle } from "lucide-react";

// 🟢 EMAIL TEMPLATES EXACTOS PARA RESEND
const EMAIL_TEMPLATES = {
  puntos_recibidos: {
    id: "puntos_recibidos",
    tipo: "Puntos Recibidos",
    color: "emerald",
    icon: Zap,
    from: "EcoRecicla <notificaciones@ecorecicla.popayan.co>",
    to: "usuario@gmail.com",
    subject: "¡🌱 Ganaste {puntos} Puntos Eco!",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
    .logo { width: 60px; height: 60px; background: white; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 16px; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .points-badge { background: #ecfdf5; border: 2px solid #10b981; border-radius: 20px; padding: 20px; text-align: center; margin: 20px 0; }
    .points-number { font-size: 48px; font-weight: 900; color: #10b981; line-height: 1; }
    .points-label { font-size: 14px; color: #065f46; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
    .message { font-size: 16px; color: #374151; line-height: 1.6; margin: 24px 0; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌿</div>
      <h1>¡Nueva Recompensa!</h1>
    </div>
    <div class="content">
      <p class="message">
        ¡Hola <strong>{nombre}</strong>! 👋<br><br>
        Gracias por tu aporte al planeta. Acabas de recibir puntos por reciclar materiales en nuestro centro de acopio.
      </p>
      
      <div class="points-badge">
        <div class="points-number">+{puntos}</div>
        <div class="points-label">Puntos Eco</div>
      </div>
      
      <p class="message">
        <strong>Detalle de tu entrega:</strong><br>
        📍 Punto: {puntoRecoleccion}<br>
        ♻️ Material: {material}<br>
        ⚖️ Peso: {peso}kg<br>
        📅 Fecha: {fecha}
      </p>
      
      <div style="text-align: center;">
        <a href="https://ecorecicla.popayan.co/dashboard" class="cta-button">Ver mi saldo</a>
      </div>
      
      <p class="message" style="margin-top: 32px; font-size: 14px; color: #6b7280;">
        💡 <strong>Tip:</strong> Con {puntosRecomendacion} puntos puedes canjear una botella ecológica en nuestro catálogo.
      </p>
    </div>
    <div class="footer">
      <p><strong>EcoRecicla Popayán</strong></p>
      <p>Calle 5 #10-100, Popayán, Colombia</p>
      <p>© 2025 Todos los derechos reservados</p>
      <p style="margin-top: 12px;"><a href="#" style="color: #10b981; text-decoration: none;">Darse de baja</a></p>
    </div>
  </div>
</body>
</html>`,
    variables: {
      puntos: "150",
      nombre: "María González",
      puntoRecoleccion: "Plaza Principal - Centro",
      material: "Plástico PET",
      peso: "3.5",
      fecha: "15 Ene 2025",
      puntosRecomendacion: "500"
    },
    javaSource: "EmailService.java -> enviarPuntosRecibidos()",
    resendEndpoint: "POST https://api.resend.com/emails"
  },
  
  canje_confirmado: {
    id: "canje_confirmado",
    tipo: "Canje Confirmado",
    color: "violet",
    icon: Gift,
    from: "EcoRecicla <premios@ecorecicla.popayan.co>",
    to: "usuario@gmail.com",
    subject: "✅ Tu Canje ha sido Aprobado",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; }
    .checkmark { width: 80px; height: 80px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 16px; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .reward-card { background: #f5f3ff; border: 2px solid #8b5cf6; border-radius: 20px; padding: 24px; margin: 20px 0; }
    .reward-name { font-size: 22px; font-weight: 800; color: #7c3aed; margin-bottom: 8px; }
    .reward-points { font-size: 14px; color: #6d28d9; font-weight: 600; }
    .info-table { width: 100%; margin: 24px 0; border-collapse: collapse; }
    .info-table td { padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
    .info-table td:first-child { font-weight: 600; width: 120px; }
    .cta-button { display: inline-block; background: #8b5cf6; color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="checkmark">✓</div>
      <h1>¡Canje Aprobado!</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        ¡Excelente noticia, <strong>{nombre}</strong>! 🎉<br><br>
        Tu solicitud de canje ha sido aprobada y está siendo preparada para entrega.
      </p>
      
      <div class="reward-card">
        <div class="reward-name">🎁 {producto}</div>
        <div class="reward-points">{puntosCanje} puntos • Saldo restante: {saldoRestante} pts</div>
      </div>
      
      <table class="info-table">
        <tr>
          <td>📦 Pedido #</td>
          <td>{pedidoId}</td>
        </tr>
        <tr>
          <td>📍 Punto de entrega</td>
          <td>{puntoEntrega}</td>
        </tr>
        <tr>
          <td>📅 Fecha estimada</td>
          <td>{fechaEntrega}</td>
        </tr>
        <tr>
          <td>🔑 Código de retiro</td>
          <td><strong style="font-size: 18px; color: #7c3aed;">{codigoRetiro}</strong></td>
        </tr>
      </table>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          ⚠️ <strong>Importante:</strong> Presenta este código junto con tu documento de identidad al momento de recoger tu premio.
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://ecorecicla.popayan.co/historial" class="cta-button">Ver mis pedidos</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>EcoRecicla Popayán</strong></p>
      <p>Calle 5 #10-100, Popayán, Colombia</p>
      <p>© 2025 Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>`,
    variables: {
      nombre: "María González",
      producto: "Botella Ecológica 750ml",
      puntosCanje: "500",
      saldoRestante: "350",
      pedidoId: "ECO-2025-001234",
      puntoEntrega: "Centro de Acopio Principal",
      fechaEntrega: "18-20 Ene 2025",
      codigoRetiro: "A7X9M2"
    },
    javaSource: "CanjeService.java -> confirmarCanje()",
    resendEndpoint: "POST https://api.resend.com/emails"
  },
  
  bote_lleno: {
    id: "bote_lleno",
    tipo: "Alerta Bote Lleno",
    color: "amber",
    icon: AlertTriangle,
    from: "EcoRecicla Logística <logistica@ecorecicla.popayan.co>",
    to: "encargado@gmail.com",
    subject: "🚨 ALERTA: Bote Lleno - Ruta Asignada",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
    .alert-icon { width: 80px; height: 80px; background: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 48px; margin-bottom: 16px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 40px 30px; }
    .alert-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 20px; padding: 24px; margin: 20px 0; }
    .fill-level { font-size: 36px; font-weight: 900; color: #d97706; line-height: 1; }
    .location-card { background: #f9fafb; border-radius: 16px; padding: 20px; margin: 20px 0; }
    .location-name { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; }
    .secondary-button { display: inline-block; background: white; color: #f59e0b; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; margin-left: 12px; border: 2px solid #f59e0b; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-icon">⚠️</div>
      <h1>Alerta de Capacidad</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Hola <strong>{encargadoNombre}</strong>,<br><br>
        Se ha detectado un punto de recolección que requiere atención inmediata.
      </p>
      
      <div class="alert-box">
        <div style="text-align: center;">
          <div class="fill-level">{nivelLlenado}%</div>
          <div style="font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase; margin-top: 8px;">Capacidad alcanzada</div>
        </div>
      </div>
      
      <div class="location-card">
        <div class="location-name">📍 {puntoNombre}</div>
        <div class="info-row">
          <span style="color: #6b7280;">Dirección:</span>
          <span style="font-weight: 600;">{direccion}</span>
        </div>
        <div class="info-row">
          <span style="color: #6b7280;">Coordenadas:</span>
          <span style="font-weight: 600;">{coordenadas}</span>
        </div>
        <div class="info-row">
          <span style="color: #6b7280;">Distancia:</span>
          <span style="font-weight: 600;">{distancia} km</span>
        </div>
        <div class="info-row">
          <span style="color: #6b7280;">Prioridad:</span>
          <span style="font-weight: 700; color: #dc2626;">🔴 ALTA</span>
        </div>
      </div>
      
      <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          🚛 <strong>Ruta sugerida:</strong> Esta recolección puede combinarse con los puntos de la ruta #${rutaSugerida} para optimizar el recorrido.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://ecorecicla.popayan.co/encargado/misiones?aceptar={puntoId}" class="cta-button">Aceptar Misión</a>
        <a href="https://ecorecicla.popayan.co/mapa" class="secondary-button">Ver mapa</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>EcoRecicla Logística</strong></p>
      <p>Sistema de Gestión de Rutas - Popayán</p>
      <p>© 2025 Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>`,
    variables: {
      encargadoNombre: "Carlos Rodríguez",
      nivelLlenado: "95",
      puntoNombre: "Plaza Principal - Centro",
      direccion: "Carrera 10 #5-20, Popayán",
      coordenadas: "2.4419° N, 76.6063° O",
      distancia: "2.3",
      rutaSugerida: "R-042",
      puntoId: "PTO-001"
    },
    javaSource: "LogisticaService.java -> notificarBoteLleno()",
    resendEndpoint: "POST https://api.resend.com/emails"
  }
};

const EmailTemplatesViewer = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("puntos_recibidos");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const template = EMAIL_TEMPLATES[selectedTemplate];
  const Icon = template.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHtmlWithVariables = () => {
    let html = template.html;
    Object.entries(template.variables).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return html;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">
            Emails Resend
          </h1>
          <p className="text-gray-500 font-medium italic text-lg">
            Templates exactos que recibiría cada persona en su Gmail
          </p>
        </div>

        {/* SELECTOR DE TEMPLATES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.values(EMAIL_TEMPLATES).map((t) => {
            const TplIcon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-6 rounded-[30px] border-2 transition-all text-left ${
                  selectedTemplate === t.id
                    ? `bg-${t.color}-500 text-white border-${t.color}-500 shadow-lg shadow-${t.color}-200`
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-2xl ${selectedTemplate === t.id ? "bg-white/20" : `bg-${t.color}-50`}`}>
                    <TplIcon size={20} />
                  </div>
                  <span className="font-black italic uppercase text-sm tracking-tight">
                    {t.tipo}
                  </span>
                </div>
                <p className={`text-xs font-medium ${selectedTemplate === t.id ? "text-white/80" : "text-gray-400"}`}>
                  {t.subject}
                </p>
              </button>
            );
          })}
        </div>

        {/* DETALLES DEL TEMPLATE */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          {/* METADATOS */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 italic block mb-1">From</label>
                <code className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-lg block">
                  {template.from}
                </code>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-gray-400 italic block mb-1">To</label>
                <code className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-lg block">
                  {template.to}
                </code>
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] font-black uppercase text-gray-400 italic block mb-1">Subject</label>
                <code className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-lg block">
                  {template.subject}
                </code>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Resend API</span>
              </div>
              <code className="text-[9px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {template.resendEndpoint}
              </code>
              <code className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {template.javaSource}
              </code>
            </div>
          </div>

          {/* VISTA PREVIA */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black italic uppercase text-gray-900">
                Vista previa del email
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(getHtmlWithVariables())}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copiado" : "Copiar HTML"}
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={`flex items-center gap-2 px-4 py-2 bg-${template.color}-500 text-white rounded-xl text-xs font-black uppercase hover:bg-${template.color}-600 transition-colors`}
                >
                  <Eye size={14} />
                  Ver en pantalla completa
                </button>
              </div>
            </div>

            {/* MINI PREVIEW */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className={`bg-${template.color}-500 px-4 py-3 flex items-center gap-2`}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                </div>
                <span className="text-white text-xs font-medium ml-2">Vista previa</span>
              </div>
              <iframe
                srcDoc={getHtmlWithVariables()}
                className="w-full h-[400px]"
                sandbox=""
              />
            </div>
          </div>

          {/* VARIABLES */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h4 className="text-sm font-black italic uppercase text-gray-700 mb-4">
              Variables dinámicas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(template.variables).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl p-3 border border-gray-200">
                  <code className="text-[9px] font-mono text-gray-400 block mb-1">
                    {`{${key}}`}
                  </code>
                  <span className="text-xs font-bold text-gray-700 truncate block">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOTA RESEND COLOMBIA */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-[30px] p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-2xl shrink-0">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-black italic uppercase text-blue-900 text-sm mb-2">
                🇨🇴 Configuración Resend para Colombia/Popayán
              </h4>
              <ul className="text-xs text-blue-800 space-y-2 font-medium">
                <li>• <strong>Dominio verificado:</strong> ecorecicla.popayan.co (requiere DNS records)</li>
                <li>• <strong>Region:</strong> Resend usa AWS us-east-1 por defecto (latencia ~150ms a Colombia)</li>
                <li>• <strong>DKIM/SPF:</strong> Configurar en Cloudflare para evitar spam</li>
                <li>• <strong>Rate limits:</strong> 3 emails/segundo en plan free, 100/day hasta verificar dominio</li>
                <li>• <strong>Webhook:</strong> Configurar en Java para trackear opens/clicks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL VISTA COMPLETA */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="absolute inset-0" onClick={() => setShowPreview(false)}></div>
          <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full cursor-pointer" onClick={() => setShowPreview(false)}></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                </div>
                <span className="text-xs font-medium text-gray-500">Gmail Preview</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <iframe
              srcDoc={getHtmlWithVariables()}
              className="flex-1 w-full"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesViewer;
