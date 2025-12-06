import React, { useMemo } from 'react';
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
// If inTextContext is true, we return plain strings so they stay inline.
const renderSafe = (nodes: DOMNode[], options: any, textStyle: any, inTextContext = false): React.ReactNode => {
    const result = domToReact(nodes, options);
    return React.Children.map(result, (child) => {
        if (typeof child === 'string') {
            return inTextContext ? child : <Text style={textStyle}>{child}</Text>;
        }
        return child;
    });
};

interface HtmlPdfProps {
  html: string;
  style?: any;
  textStyle?: any;
}

export const HtmlPdf: React.FC<HtmlPdfProps> = ({ html, style, textStyle }) => {
  
  const mergedTextStyle = useMemo(
    () => ({ ...styles.text, ...(textStyle || {}) }),
    [textStyle]
  );

  const mergedBulletStyle = useMemo(
    () => ({ ...styles.bullet, fontSize: textStyle?.fontSize ?? styles.bullet.fontSize }),
    [textStyle]
  );

  const mergedLiContentStyle = useMemo(
    () => ({ ...styles.liContent, ...(textStyle || {}) }),
    [textStyle]
  );
  
  const options = {
    replace: (domNode: DOMNode) => {
      if (isElement(domNode)) {
        const children = domNode.children as DOMNode[];

        // Block Elements -> Return View
        if (domNode.name === 'ul' || domNode.name === 'ol') {
          return <View style={styles.ul}>{renderSafe(children, options, mergedTextStyle)}</View>;
        }
        
        if (domNode.name === 'li') {
          return (
            <Text style={mergedTextStyle}>
              {'\u2022'} {renderSafe(children, options, mergedTextStyle, true)}
            </Text>
          );
        }
        
        if (domNode.name === 'p' || domNode.name === 'div') {
           return <View style={styles.p}>{renderSafe(children, options, mergedTextStyle)}</View>;
        }

        // Formatting (Inline) Elements -> Return Text
        const isFormattingTag = ['strong', 'b', 'em', 'i', 'u', 'span'].includes(domNode.name);
        
        if (isFormattingTag) {
            // Check if any children are blocks. If so, we cannot return <Text>.
            const hasBlockChildren = children.some(child => isBlock(child));
            
            if (hasBlockChildren) {
                return <View>{renderSafe(children, options, mergedTextStyle)}</View>;
            }

            // Safe to return Text
            const styleProp: any[] = [];
            if (domNode.name === 'strong' || domNode.name === 'b') styleProp.push(styles.bold);
            if (domNode.name === 'em' || domNode.name === 'i') styleProp.push(styles.italic);
            if (domNode.name === 'u') styleProp.push({ textDecoration: 'underline' });
            styleProp.push(mergedTextStyle);
            
            // IMPORTANT: We use renderSafe even inside Text. 
            // react-pdf allows <Text><Text>string</Text></Text>.
            return <Text style={styleProp}>{renderSafe(children, options, mergedTextStyle, true)}</Text>;
        }

        if (domNode.name === 'br') {
            return <Text>{'\n'}</Text>;
        }

        // For other tags, if they contain blocks, use View, else Text
        if (children.some(child => isBlock(child))) {
            return <View>{renderSafe(children, options, mergedTextStyle)}</View>;
        } else {
            return <Text style={mergedTextStyle}>{renderSafe(children, options, mergedTextStyle, true)}</Text>;
        }
      }
      
      if (domNode.type === 'text') {
        // Defensive: Wrap text in Text component. renderSafe handles inline contexts via strings.
        return <Text style={mergedTextStyle}>{domNode.data}</Text>;
      }
    }
  };
  
  // Parse the HTML
  const parsed = parse(html || '', options);
  
  // Final safety map for top-level nodes
  const sanitized = React.Children.map(parsed, (child) => {
      if (typeof child === 'string') {
          return <Text style={mergedTextStyle}>{child}</Text>;
      }
      return child;
  });

  return (
    <View style={style}>
      {sanitized}
    </View>
  );
};
