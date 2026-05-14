import { useRef } from 'react'
import { useApp } from '../context/AppContext'

export default function NavigationTabBar() {
  const { state, setActiveTab } = useApp()
  const { navigationTabs, activeTab } = state
  const sorted = [...navigationTabs].sort((a, b) => a.order - b.order)
  const scrollRef = useRef(null)

  function scroll(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += dir * 160
    }
  }

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid var(--sap-border)',
      height: 'var(--sap-tab-height)',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      position: 'relative',
      zIndex: 100
    }}>
      <button
        onClick={() => scroll(-1)}
        style={{ background: 'none', border: 'none', padding: '0 8px', cursor: 'pointer', color: 'var(--sap-text-secondary)', flexShrink: 0, fontSize: '14px' }}
      >
        &lt;
      </button>
      <div
        ref={scrollRef}
        style={{
          display: 'flex', alignItems: 'stretch', flex: 1,
          overflowX: 'auto', scrollBehavior: 'smooth',
          height: '100%'
        }}
        className="no-scrollbar"
      >
        {sorted.map(tab => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flexShrink: 0,
                padding: '0 16px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--sap-blue)' : '2px solid transparent',
                color: isActive ? 'var(--sap-blue)' : 'var(--sap-text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: '100%',
                transition: 'color 0.15s, border-color 0.15s'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => scroll(1)}
        style={{ background: 'none', border: 'none', padding: '0 8px', cursor: 'pointer', color: 'var(--sap-text-secondary)', flexShrink: 0, fontSize: '14px' }}
      >
        &gt;
      </button>
    </div>
  )
}
