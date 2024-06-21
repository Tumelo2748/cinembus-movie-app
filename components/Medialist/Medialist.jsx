import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';

const MediaList = ({ header, data, keyExtractor, renderItem, isGrid }) => {
  const renderSeparator = () => <View style={styles.itemSeparator} />;

  return (
    <View style={styles.container}>
      {header && !isGrid && <Text style={styles.header}>{header}</Text>}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <View style={isGrid ? styles.gridItem : null}>{renderItem({ item, index })}</View>
        )}
        horizontal={!isGrid}
        numColumns={isGrid ? 2 : 1}
        key={isGrid ? 'g' : 'h'}
        showsHorizontalScrollIndicator={!isGrid}
        showsVerticalScrollIndicator={isGrid}
        ItemSeparatorComponent={!isGrid ? renderSeparator : null}
        contentContainerStyle={isGrid ? styles.gridContentContainer : styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    marginLeft: 10,
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  gridContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemSeparator: {
    width: 10,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    marginLeft: 7,
  },
});

export default MediaList;
