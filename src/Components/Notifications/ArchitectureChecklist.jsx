import { useState } from "react";
import { 
  Check, 
  CheckCircle2, 
  Circle, 
  Server, 
  Database, 
  Code, 
  Bell, 
  Mail, 
  Smartphone,
  FileCode,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const ArchitectureChecklist = () => {
  const [expandedSections, setExpandedSections] = useState({
    backend: true,
    frontend: true,
    resend: true,
    push: true,
    db: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const checklistItems = {
    backend: [
      {
        id: "usuario-columns",
        done: false,
        title: "Agregar columnas en Usuario.java",
        description: "Añadir campos para preferencias de notificación",
        code: `// Usuario.java - Entity
@Entity
@Table(name = "usuarios")
public class Usuario {
    // ... campos existentes ...
    
    // 🆕 NUEVAS COLUMNAS PARA NOTIFICACIONES
    @Column(name = "notificaciones_push", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean notificacionesPush = true;
    
    @Column(name = "notificaciones_email", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean notificacionesEmail = true;
    
    @Column(name = "preferencias_notificacion", columnDefinition = "JSON DEFAULT NULL")
    private String preferenciasNotificacion; // JSON con config por rol
    
    // Getters y Setters
    public Boolean getNotificacionesPush() { return notificacionesPush; }
    public void setNotificacionesPush(Boolean push) { this.notificacionesPush = push; }
    
    public Boolean getNotificacionesEmail() { return notificacionesEmail; }
    public void setNotificacionesEmail(Boolean email) { this.notificacionesEmail = email; }
    
    public String getPreferenciasNotificacion() { return preferenciasNotificacion; }
    public void setPreferenciasNotificacion(String preferencias) { 
        this.preferenciasNotificacion = preferencias; 
    }
}`,
        file: "src/main/java/com/ecorecicla/model/Usuario.java",
        priority: "HIGH"
      },
      {
        id: "notificacion-entity",
        done: false,
        title: "Crear entidad Notificacion.java",
        description: "Tabla para almacenar notificaciones de usuarios",
        code: `// Notificacion.java - Nueva Entity
@Entity
@Table(name = "notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @Column(name = "tipo", nullable = false, length = 50)
    private String tipo; // puntos_recibidos, bote_lleno, canje_confirmado, etc.
    
    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;
    
    @Column(name = "mensaje", columnDefinition = "TEXT")
    private String mensaje;
    
    @Column(name = "leida", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean leida = false;
    
    @Column(name = "email_enviado", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean emailEnviado = false;
    
    @Column(name = "push_eniado", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean pushEnviado = false;
    
    @Column(name = "fecha_creacion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion = new Date();
    
    @Column(name = "java_source", length = 100)
    private String javaSource; // Clase Java que originó la notificación
    
    // Getters y Setters...
}`,
        file: "src/main/java/com/ecorecicla/model/Notificacion.java",
        priority: "HIGH"
      },
      {
        id: "preferencias-controller",
        done: false,
        title: "Endpoint de preferencias",
        description: "API para guardar/cargar preferencias de notificación",
        code: `// NotificacionController.java - Nuevo Controller
@RestController
@RequestMapping("/api/preferencias")
@CrossOrigin(origins = "*")
public class NotificacionController {
    
    @Autowired
    private NotificacionService notificacionService;
    
    // GET /api/preferencias/notificaciones?usuarioId={id}
    @GetMapping("/notificaciones")
    public ResponseEntity<?> obtenerPreferencias(@RequestParam Long usuarioId) {
        try {
            Map<String, Object> prefs = notificacionService.obtenerPreferencias(usuarioId);
            return ResponseEntity.ok(prefs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    // POST /api/preferencias/notificaciones
    @PostMapping("/notificaciones")
    public ResponseEntity<?> guardarPreferencias(@RequestBody PreferenciasRequest request) {
        try {
            notificacionService.guardarPreferencias(
                request.getUsuarioId(),
                request.getRol(),
                request.getPreferencias()
            );
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    // DTO Request
    public static class PreferenciasRequest {
        private Long usuarioId;
        private String rol;
        private Map<String, Map<String, Boolean>> preferencias;
        // Getters y Setters...
    }
}`,
        file: "src/main/java/com/ecorecicla/controller/NotificacionController.java",
        priority: "HIGH"
      },
      {
        id: "notificaciones-endpoint",
        done: false,
        title: "Endpoint de notificaciones",
        description: "API para obtener/marcar notificaciones",
        code: `// En NotificacionController.java
    
    // GET /api/notificaciones?usuarioId={id}&rol={rol}
    @GetMapping("/notificaciones")
    public ResponseEntity<?> obtenerNotificaciones(
        @RequestParam Long usuarioId,
        @RequestParam(required = false) String rol
    ) {
        try {
            List<NotificacionDTO] notifs = notificacionService.obtenerPorUsuario(usuarioId, rol);
            return ResponseEntity.ok(notifs);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    // POST /api/notificaciones/marcar-leidas
    @PostMapping("/notificaciones/marcar-leidas")
    public ResponseEntity<?> marcarTodasLeidas(@RequestBody Map<String, Long> body) {
        try {
            notificacionService.marcarTodasLeidas(body.get("usuarioId"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }`,
        file: "src/main/java/com/ecorecicla/controller/NotificacionController.java",
        priority: "MEDIUM"
      },
      {
        id: "email-service",
        done: false,
        title: "Servicio de Email con Resend",
        description: "Integración con API de Resend para envío de emails",
        code: `// EmailService.java - Nuevo Service
@Service
public class EmailService {
    
    @Value("\${resend.api.key}")
    private String resendApiKey;
    
    private static final String RESEND_URL = "https://api.resend.com/emails";
    
    // Método genérico para enviar emails
    public boolean enviarEmail(String to, String subject, String html) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            
            JSONObject body = new JSONObject();
            body.put("from", "EcoRecicla <notificaciones@ecorecicla.popayan.co>");
            body.put("to", to);
            body.put("subject", subject);
            body.put("html", html);
            body.put("tags", Map.of("app", "ecorecicla", "type", "notification"));
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RESEND_URL))
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            return response.statusCode() == 200;
        } catch (Exception e) {
            System.err.println("❌ Error enviando email: " + e.getMessage());
            return false;
        }
    }
    
    // Métodos específicos por template
    public void enviarPuntosRecibidos(Usuario usuario, int puntos, String material) {
        String html = loadTemplate("puntos_recibidos", Map.of(
            "nombre", usuario.getNombre(),
            "puntos", String.valueOf(puntos),
            "material", material
        ));
        enviarEmail(usuario.getCorreo(), "¡🌱 Ganaste " + puntos + " Puntos Eco!", html);
    }
    
    public void enviarCanjeConfirmado(Usuario usuario, Canje canje) {
        // Similar al anterior...
    }
    
    public void enviarBoteLleno(Encargado encargado, PuntoRecoleccion punto) {
        // Similar al anterior...
    }
    
    private String loadTemplate(String templateName, Map<String, String> vars) {
        // Cargar HTML desde resources/templates/ y reemplazar variables
    }
}`,
        file: "src/main/java/com/ecorecicla/service/EmailService.java",
        priority: "HIGH"
      },
      {
        id: "web-push-service",
        done: false,
        title: "Servicio de Web Push",
        description: "Implementación de VAPID para push nativas",
        code: `// WebPushService.java - Nuevo Service
@Service
public class WebPushService {
    
    @Value("\${webpush.vapid.publicKey}")
    private String vapidPublicKey;
    
    @Value("\${webpush.vapid.privateKey}")
    private String vapidPrivateKey;
    
    @Value("\${webpush.vapid.subject}")
    private String vapidSubject; // mailto:admin@ecorecicla.popayan.co
    
    // Suscribirse a notificaciones push
    public void suscribir(PushSubscription subscription) {
        // Guardar subscription en DB (tabla push_subscriptions)
    }
    
    // Enviar notificación push
    public void enviarPush(Long usuarioId, String title, String body) {
        List<PushSubscription> subscriptions = getSubscriptions(usuarioId);
        
        for (PushSubscription sub : subscriptions) {
            try {
                Notification notification = new Notification(title, body);
                
                Message message = new Message(sub.getEndpoint(), notification);
                
                SendResponse response = new PushSender(vapidPublicKey, vapidPrivateKey, vapidSubject)
                    .send(message);
                    
                if (!response.isSuccess()) {
                    // Eliminar subscription inválida
                    eliminarSubscription(sub.getId());
                }
            } catch (Exception e) {
                System.err.println("Error enviando push: " + e.getMessage());
            }
        }
    }
}`,
        file: "src/main/java/com/ecorecicla/service/WebPushService.java",
        priority: "MEDIUM"
      },
    ],
    
    frontend: [
      {
        id: "notification-feed",
        done: true,
        title: "Feed de Notificaciones",
        description: "Componente NotificationFeed.jsx creado",
        file: "src/Components/Profile/NotificationFeed.jsx",
        priority: "DONE"
      },
      {
        id: "notification-preferences",
        done: true,
        title: "Preferencias de Notificación",
        description: "Componente NotificationPreferences.jsx creado",
        file: "src/Components/Profile/NotificationPreferences.jsx",
        priority: "DONE"
      },
      {
        id: "email-templates",
        done: true,
        title: "Visor de Templates de Email",
        description: "Componente EmailTemplatesViewer.jsx creado",
        file: "src/Components/Notifications/EmailTemplatesViewer.jsx",
        priority: "DONE"
      },
      {
        id: "push-setup",
        done: false,
        title: "Configurar Web Push en Frontend",
        description: "Service Worker y registro de push",
        code: `// src/utils/webPush.js
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    return registration;
  }
  return null;
}

export async function subscribeToPush() {
  const registration = await registerServiceWorker();
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  
  // Enviar subscription al backend
  await fetch('http://localhost:8080/api/push/suscribir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
  
  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}`,
        file: "src/utils/webPush.js",
        priority: "MEDIUM"
      },
      {
        id: "service-worker",
        done: false,
        title: "Service Worker para Push",
        description: "Manejador de notificaciones push en segundo plano",
        code: `// public/sw.js - Service Worker
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY';

self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/dashboard'
    },
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});`,
        file: "public/sw.js",
        priority: "MEDIUM"
      },
    ],
    
    db: [
      {
        id: "migration-notificaciones",
        done: false,
        title: "Script SQL - Tabla notificaciones",
        description: "Crear tabla para almacenar notificaciones",
        code: `-- MySQL Migration Script

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    leida BOOLEAN DEFAULT FALSE,
    email_enviado BOOLEAN DEFAULT FALSE,
    push_enviado BOOLEAN DEFAULT FALSE,
    java_source VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de subscripciones push
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_endpoint (endpoint(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columnas a usuarios (si no existen)
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS notificaciones_push BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notificaciones_email BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS preferencias_notificacion JSON DEFAULT NULL;`,
        file: "db/migrations/V005__notificaciones.sql",
        priority: "HIGH"
      },
    ],
    
    resend: [
      {
        id: "resend-config",
        done: false,
        title: "Configurar Resend para Colombia",
        description: "Setup de dominio y DNS para ecorecicla.popayan.co",
        code: `# .env - Backend Spring Boot

# Resend API Key (obtener de https://resend.com/api-keys)
resend.api.key=re_xxxxxxxxxxxxxxxxxxxxx

# Web Push VAPID Keys (generar con web-push library)
webpush.vapid.publicKey=BKxNxxxxx...
webpush.vapid.privateKey=xxxxxxxxxxxxx...
webpush.vapid.subject=mailto:admin@ecorecicla.popayan.co

# Configuración específica Colombia
app.timezone=America/Bogota
app.locale=es_CO`,
        file: ".env",
        priority: "HIGH"
      },
      {
        id: "dns-records",
        done: false,
        title: "Records DNS para Resend",
        description: "Configurar en Cloudflare/GoDaddy para Popayán",
        code: `# DNS Records para ecorecicla.popayan.co

# SPF Record (evitar spam)
Type: TXT
Name: @
Value: "v=spf1 include:resend.dev ~all"

# DKIM Record (autenticación)
Type: TXT
Name: resend._domainkey
Value: "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ..."

# DMARC Record (política de envío)
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=none; rua=mailto:dmarc@ecorecicla.popayan.co"

# Nota: Estos valores se obtienen del dashboard de Resend
# después de agregar el dominio verificado.`,
        file: "DNS Configuration",
        priority: "HIGH"
      },
    ],
    
    push: [
      {
        id: "push-flow",
        done: false,
        title: "Flujo de Implementación Push Nativa",
        description: "5 pasos para activar notificaciones push",
        steps: [
          {
            step: 1,
            title: "Generar claves VAPID",
            description: "Usar biblioteca web-push para crear key pair",
            command: "npx web-push generate-vapid-keys --details"
          },
          {
            step: 2,
            title: "Configurar Service Worker",
            description: "Crear public/sw.js con manejadores de push y click",
            file: "public/sw.js"
          },
          {
            step: 3,
            title: "Registrar Service Worker en React",
            description: " Llamar a registerServiceWorker() en App.jsx",
            code: `// En App.jsx useEffect inicial\nuseEffect(() => {\n  if ('serviceWorker' in navigator && user) {\n    registerServiceWorker().then(reg => {\n      console.log('SW registrado:', reg.scope);\n      // Pedir permiso de notificación\n      if (Notification.permission === 'default') {\n        Notification.requestPermission();\n      }\n    });\n  }\n}, [user]);`
          },
          {
            step: 4,
            title: "Suscribir usuario a push",
            description: "Obtener subscription y enviar al backend",
            code: `// Cuando usuario activa toggle de push\nconst subscribe = async () => {\n  const registration = await navigator.serviceWorker.ready;\n  const subscription = await registration.pushManager.subscribe({\n    userVisibleOnly: true,\n    applicationServerKey: VAPID_PUBLIC_KEY\n  });\n  \n  await fetch('/api/push/suscribir', {\n    method: 'POST',\n    body: JSON.stringify(subscription)\n  });\n};`
          },
          {
            step: 5,
            title: "Enviar notificaciones desde Java",
            description: "Usar WebPushService para notificar eventos",
            code: `// En cualquier servicio cuando ocurre un evento\n@Autowired\nprivate WebPushService pushService;\n\npublic void procesarEntrega(Usuario usuario, Entrega entrega) {\n    // ... lógica de negocio ...\n    \n    // Enviar push notification\n    pushService.enviarPush(\n        usuario.getId(),\n        "¡Puntos recibidos! 🌱",\n        "Ganaste " + entrega.getPuntos() + " puntos por reciclar"\n    );\n}`
          }
        ],
        priority: "MEDIUM"
      },
    ]
  };

  const Section = ({ title, icon: Icon, items, sectionKey }) => (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-6 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl">
            <Icon size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-black italic uppercase text-gray-900 tracking-tight">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {items.filter(i => i.done).length}/{items.length} completados
          </span>
          {expandedSections[sectionKey] ? (
            <ChevronDown size={20} className="text-gray-400" />
          ) : (
            <ChevronRight size={20} className="text-gray-400" />
          )}
        </div>
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="p-6 space-y-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );

  const ItemCard = ({ item }) => {
    const [showCode, setShowCode] = useState(false);
    
    return (
      <div className={`border-2 rounded-[30px] p-5 transition-all ${
        item.done 
          ? "border-emerald-200 bg-emerald-50/50" 
          : item.priority === "HIGH"
          ? "border-amber-200 bg-amber-50/30"
          : "border-gray-200 bg-white"
      }`}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`mt-1 shrink-0 ${item.done ? "text-emerald-500" : "text-gray-300"}`}>
              {item.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-black italic uppercase text-sm ${
                  item.done ? "text-emerald-800" : "text-gray-900"
                }`}>
                  {item.title}
                </h4>
                {item.priority === "HIGH" && !item.done && (
                  <span className="text-[9px] font-black uppercase bg-red-500 text-white px-2 py-0.5 rounded-full">
                    Prioritario
                  </span>
                )}
                {item.priority === "DONE" && (
                  <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    Completado
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-medium">{item.description}</p>
              {item.file && (
                <code className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  {item.file}
                </code>
              )}
            </div>
          </div>
          
          {(item.code || item.steps) && (
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <FileCode size={18} className="text-gray-400" />
            </button>
          )}
        </div>
        
        {showCode && item.code && (
          <div className="mt-4 bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
              <span className="text-xs font-mono text-gray-400">{item.file}</span>
              <button
                onClick={() => navigator.clipboard.writeText(item.code)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Copiar
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
              {item.code}
            </pre>
          </div>
        )}
        
        {showCode && item.steps && (
          <div className="mt-4 space-y-3">
            {item.steps.map((step, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-sm">
                    {step.step}
                  </div>
                  <h5 className="font-black italic uppercase text-sm text-gray-900">
                    {step.title}
                  </h5>
                </div>
                <p className="text-xs text-gray-600 font-medium ml-11 mb-2">
                  {step.description}
                </p>
                {step.command && (
                  <code className="text-[10px] font-mono bg-gray-900 text-emerald-400 px-3 py-2 rounded-lg block ml-11">
                    {step.command}
                  </code>
                )}
                {step.code && (
                  <pre className="text-[10px] font-mono bg-gray-900 text-gray-300 p-3 rounded-lg ml-11 overflow-x-auto">
                    {step.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">
            Arquitectura de Notificaciones
          </h1>
          <p className="text-gray-500 font-medium italic text-lg">
            Checklist completo de implementación backend + frontend
          </p>
        </div>

        {/* RESUMEN */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(checklistItems).map(([key, items]) => (
            <div key={key} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-black text-emerald-500 mb-1">
                {items.filter(i => i.done).length}/{items.length}
              </div>
              <div className="text-[9px] font-bold uppercase text-gray-400">
                {key}
              </div>
            </div>
          ))}
        </div>

        {/* SECCIONES */}
        <Section 
          title="Backend - Java Spring Boot" 
          icon={Server} 
          items={checklistItems.backend} 
          sectionKey="backend" 
        />
        
        <Section 
          title="Frontend - React" 
          icon={Code} 
          items={checklistItems.frontend} 
          sectionKey="frontend" 
        />
        
        <Section 
          title="Base de Datos" 
          icon={Database} 
          items={checklistItems.db} 
          sectionKey="db" 
        />
        
        <Section 
          title="Resend - Emails (Colombia)" 
          icon={Mail} 
          items={checklistItems.resend} 
          sectionKey="resend" 
        />
        
        <Section 
          title="Push Nativa - 5 Pasos" 
          icon={Smartphone} 
          items={checklistItems.push} 
          sectionKey="push" 
        />

        {/* NOTA FINAL */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[40px] p-8 text-white">
          <h3 className="text-2xl font-black italic uppercase mb-4">
            🚀 Próximos Pasos - Prioridad 1
          </h3>
          <ol className="space-y-3 text-sm font-medium">
            <li className="flex items-start gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-black">1</span>
              <span>Implementar columnas en Usuario.java (entity + migración SQL)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-black">2</span>
              <span>Crear endpoint POST /api/preferencias/notificaciones</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-black">3</span>
              <span>Conectar toggles de NotificationPreferences.jsx al backend</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-black">4</span>
              <span>Configurar cuenta Resend y DNS para ecorecicla.popayan.co</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded font-black">5</span>
              <span>Implementar service worker para push nativa</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureChecklist;
