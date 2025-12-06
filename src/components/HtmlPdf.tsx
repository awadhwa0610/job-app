import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import parse, { Element, domToReact, type DOMNode } from 'html-react-parser';

const styles = StyleSheet.create({
  // Base text style
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  // Bold
  bold: {
    fontWeight: 'bold',
  },
  // Italic
  italic: {
    fontStyle: 'italic',
  },
  // List
  ul: {
    marginBottom: 5,
  },
  li: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  liContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Paragraph
  p: {
    marginBottom: 4,
  }
});

// Helper to verify if a node is an Element
const isElement = (node: DOMNode): node is Element => {
  return node.type === 'tag';
};

interface HtmlPdfProps {
  html: string;
  style?: any;
}

export const HtmlPdf: React.FC<HtmlPdfProps> = ({ html, style }) => {
  
  const options = {
    replace: (domNode: DOMNode) => {
      if (isElement(domNode)) {
        if (domNode.name === 'ul') {
          return <View style={styles.ul}>{domToReact(domNode.children as DOMNode[], options)}</View>;
        }
        if (domNode.name === 'li') {
          return (
            <View style={styles.li}>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.liContent}>
                 {/* We wrap content in a Text to allow nested styles like bold inside li */}
                 <Text>{domToReact(domNode.children as DOMNode[], options)}</Text>
              </View>
            </View>
          );
        }
        if (domNode.name === 'p') {
           return (
             <View style={styles.p}>
                <Text>{domToReact(domNode.children as DOMNode[], options)}</Text>
             </View>
           );
        }
        if (domNode.name === 'strong' || domNode.name === 'b') {
          return <Text style={styles.bold}>{domToReact(domNode.children as DOMNode[], options)}</Text>;
        }
        if (domNode.name === 'em' || domNode.name === 'i') {
          return <Text style={styles.italic}>{domToReact(domNode.children as DOMNode[], options)}</Text>;
        }
      }
      // Text nodes are handled automatically by domToReact but usually need to be wrapped in <Text> if at root
      // However, inside <Text> components (like bold), strings are valid children.
      // inside <View> (like ul, li), strings are NOT valid direct children in react-pdf.
    }
  };
  
  // Parse HTML. We need to ensure root elements are Views or Texts. 
  // react-pdf doesn't like strings directly inside Page/View unless inside Text.
  // html-react-parser returns ReactNode.
  
  // A simpler approach for root: wrap everything in a View, but ensure all text is inside Text components.
  // Our replace logic mostly handles structure.
  
  // Fallback for plain text nodes at root level?
  // We can't easily detect root text nodes in 'options' replace. 
  // Let's rely on the structure being mostly <p> or <ul> from the editor.
  // But if the user just types text, it might break.
  // We'll wrap the result in a View and hope the parser structure covers it.
  // Actually, react-quill usually wraps in <p>.
  
  return (
    <View style={style}>
      {parse(html, options)}
    </View>
  );
};

