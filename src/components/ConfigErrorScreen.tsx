function ConfigErrorScreen({ message }: { message: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D0D0D',
        color: '#E5E5E5',
        fontFamily: 'Montserrat, sans-serif',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          border: '1px solid rgba(197, 160, 89, 0.3)',
          borderRadius: 16,
          padding: '2rem',
          background: 'rgba(45, 45, 45, 0.4)',
        }}
      >
        <p
          style={{
            color: '#C5A059',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Configuration Error
        </p>
        <p style={{ lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  )
}

export default ConfigErrorScreen
