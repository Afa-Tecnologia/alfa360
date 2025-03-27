export const cleanUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return null;

  try {
    // Se a URL parece ser uma string JSON, tenta parseá-la
    if (imageUrl.startsWith('[') && imageUrl.endsWith(']')) {
      const parsedUrls = JSON.parse(imageUrl);
      if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
        // Retorna a primeira URL válida do array
        const firstUrl = parsedUrls[0];
        return typeof firstUrl === 'string'
          ? firstUrl.replace(/\\/g, '')
          : null;
      }
    }

    // Se for uma string simples, limpa as barras invertidas e retorna
    return imageUrl.replace(/\\/g, '');
  } catch (error) {
    console.error('Erro ao processar URL da imagem:', error);
    // Em caso de erro no parsing, retorna a URL original sem barras invertidas
    return imageUrl.replace(/\\/g, '');
  }
};
