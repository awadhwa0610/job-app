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
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  ul: { marginBottom: 5 },
  li: { flexDirection: 'row', marginBottom: 2 },
  bullet: { width: 10, fontSize: 10 },
  liContent: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  p: { marginBottom: 4 }
});

const isElement = (node: DOMNode): node is Element => {
  return node.type === 'tag';
};

// Helper to check if a node is a block element
const isBlock = (node: DOMNode): boolean => {
    if (!isElement(node)) return false;
    return ['div', 'p', 'ul', 'ol', 'li', 'section', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.name);
};

// Safe render function that guarantees no raw strings leak out
const renderSafe = (nodes: DOMNode[], options: any): React.ReactNode => {
    const result = domToReact(nodes, options);
    return React.Children.map(result, (child) => {
        if (typeof child === 'string') {
            return <Text>{child}</Text>;
        }
        return child;
    });
};

interface HtmlPdfProps {
  html: string;
  style?: any;
}

export const HtmlPdf: React.FC<HtmlPdfProps> = ({ html, style }) => {
  
  const options = {
    replace: (domNode: DOMNode) => {
      if (isElement(domNode)) {
        const children = domNode.children as DOMNode[];

        // Block Elements -> Return View
        if (domNode.name === 'ul' || domNode.name === 'ol') {
          return <View style={styles.ul}>{renderSafe(children, options)}</View>;
        }
        
        if (domNode.name === 'li') {
          return (
            <View style={styles.li}>
              <Text style={styles.bullet}>•</Text>
              <View style={styles.liContent}>
                 {renderSafe(children, options)}
              </View>
            </View>
          );
        }
        
        if (domNode.name === 'p' || domNode.name === 'div') {
           return <View style={styles.p}>{renderSafe(children, options)}</View>;
        }

        // Formatting (Inline) Elements -> Return Text
        const isFormattingTag = ['strong', 'b', 'em', 'i', 'u', 'span'].includes(domNode.name);
        
        if (isFormattingTag) {
            // Check if any children are blocks. If so, we cannot return <Text>.
            const hasBlockChildren = children.some(child => isBlock(child));
            
            if (hasBlockChildren) {
                return <View>{renderSafe(children, options)}</View>;
            }

            // Safe to return Text
            const styleProp: any[] = [];
            if (domNode.name === 'strong' || domNode.name === 'b') styleProp.push(styles.bold);
            if (domNode.name === 'em' || domNode.name === 'i') styleProp.push(styles.italic);
            if (domNode.name === 'u') styleProp.push({ textDecoration: 'underline' });
            
            // IMPORTANT: We use renderSafe even inside Text. 
            // react-pdf allows <Text><Text>string</Text></Text>.
            return <Text style={styleProp}>{renderSafe(children, options)}</Text>;
        }

        if (domNode.name === 'br') {
            return <Text>{'\n'}</Text>;
        }

        // For other tags, if they contain blocks, use View, else Text
        if (children.some(child => isBlock(child))) {
            return <View>{renderSafe(children, options)}</View>;
        } else {
            return <Text>{renderSafe(children, options)}</Text>;
        }
      }
      
      if (domNode.type === 'text') {
        // Defensive: Wrap text in Text component
        // Even though renderSafe also handles this, doing it here ensures domToReact returns elements.
        return <Text>{domNode.data}</Text>;
      }
    }
  };
  
  // Parse the HTML
  const parsed = parse(html || '', options);
  
  // Final safety map for top-level nodes
  const sanitized = React.Children.map(parsed, (child) => {
      if (typeof child === 'string') {
          return <Text>{child}</Text>;
      }
      return child;
  });

  return (
    <View style={style}>
      {sanitized}
    </View>
  );
};
