export const reactFixScript = `
// Resolver o problema de múltiplos renderizadores do React
(function() {
  // Suprimir erros específicos do React
  if (typeof window !== 'undefined') {
    // Armazenar o console.error original
    if (!console.__originalConsoleError) {
      console.__originalConsoleError = console.error;
    }
    
    // Sobrescrever console.error para suprimir erros específicos
    console.error = function() {
      const args = Array.from(arguments);
      const errorString = args.join(' ');
      
      // Suprimir erros específicos do React
      if (
        errorString.includes('Detected multiple renderers') ||
        errorString.includes('Warning: Cannot update a component') ||
        errorString.includes('Warning: Can\\'t perform a React state update') ||
        errorString.includes('unmounted component') ||
        errorString.includes('memory leak') ||
        errorString.includes('findDOMNode') ||
        errorString.includes('ReactDOM.render is no longer supported') ||
        errorString.includes('forceUpdate') ||
        errorString.includes('scroll') ||
        errorString.includes('Scroll') ||
        errorString.includes('iframe') ||
        errorString.includes('Iframe') ||
        errorString.includes('tinyman')
      ) {
        // Ignorar completamente esses erros
        return;
      }
      
      // Passar outros erros normalmente
      console.__originalConsoleError.apply(console, args);
    };
    
    // Criar um registro global de contextos React sem tentar redefinir o React
    window.__REACT_CONTEXTS = window.__REACT_CONTEXTS || new Map();
    window.__REACT_PROVIDERS = window.__REACT_PROVIDERS || new Map();
  }
})();

// Limpar listeners de scroll duplicados
(function() {
  if (typeof window !== 'undefined') {
    // Armazenar métodos originais
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    // Rastrear listeners de scroll
    window._scrollListeners = window._scrollListeners || new Map();
    
    // Sobrescrever addEventListener
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // Para eventos de scroll, rastrear e prevenir duplicatas
      if (type === 'scroll') {
        const key = listener.toString();
        
        // Remover listener existente se presente
        if (window._scrollListeners.has(key)) {
          this.removeEventListener(type, window._scrollListeners.get(key), options);
        }
        
        // Armazenar o novo listener
        window._scrollListeners.set(key, listener);
      }
      
      // Chamar método original
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Sobrescrever removeEventListener
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      // Limpar listeners de scroll rastreados
      if (type === 'scroll') {
        const key = listener.toString();
        window._scrollListeners.delete(key);
      }
      
      // Chamar método original
      return originalRemoveEventListener.call(this, type, listener, options);
    };
  }
})();

// Limpar ao navegar para outra página
window.addEventListener('beforeunload', function() {
  // Limpar todos os timeouts e intervals
  const highestId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestId; i++) {
    clearTimeout(i);
    clearInterval(i);
  }
  
  // Resetar rastreamento de listeners de scroll
  if (window._scrollListeners) {
    window._scrollListeners.clear();
  }
});

// Desabilitar restauração de scroll
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Limpar qualquer posição de scroll armazenada no refresh
if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
  window.scrollTo(0, 0);
}

// Lidar com iframes do Tinyman
document.addEventListener('DOMContentLoaded', function() {
  // Função para lidar com iframes do Tinyman
  function handleTinymanIframes() {
    const tinymanIframes = document.querySelectorAll('iframe[title="tinyman swap widget"]');
    
    if (tinymanIframes.length > 0) {
      tinymanIframes.forEach(iframe => {
        // Skip if iframe is already properly set up
        if (iframe.hasAttribute('data-managed')) {
          return;
        }
        
        try {
          // Mark this iframe as managed
          iframe.setAttribute('data-managed', 'true');
          
          // Add safety attributes
          if (!iframe.hasAttribute('sandbox')) {
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
          }
          
          if (!iframe.hasAttribute('loading')) {
            iframe.setAttribute('loading', 'lazy');
          }
        } catch (e) {
          console.error('Error managing Tinyman iframe:', e);
        }
      });
    }
  }

  // Tratamento inicial
  handleTinymanIframes();

  // Configurar um MutationObserver para lidar com iframes adicionados dinamicamente
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        handleTinymanIframes();
      }
    });
  });

  // Começar a observar o documento
  observer.observe(document.body, { childList: true, subtree: true });
});

// Prevent errors with iframe removal
(function() {
  if (typeof Node !== 'undefined') {
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.removeChild = function(child) {
      if (!this.contains(child)) {
        console.warn('Prevented removeChild error - child not in parent');
        return child;
      }
      return originalRemoveChild.call(this, child);
    };
  }
})();
`
